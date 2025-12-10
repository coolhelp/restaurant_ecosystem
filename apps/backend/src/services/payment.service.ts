/**
 * Payment Service
 * 
 * Handles all payment processing including:
 * - Authorize.Net integration
 * - Clover terminal integration
 * - Ingenico terminal integration
 * - Payment tokenization
 * - Refund processing
 * - Payment status management
 */

import { PrismaClient, PaymentMethod, PaymentStatus } from '@prisma/client';
import axios from 'axios';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// ============================================
// INTERFACES
// ============================================

export interface ChargeInput {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  cardToken?: string;
  terminalId?: string;
}

export interface AuthorizeNetRequest {
  createTransactionRequest: {
    merchantAuthentication: {
      name: string;
      transactionKey: string;
    };
    refId?: string;
    transactionRequest: {
      transactionType: string;
      amount: string;
      payment?: {
        creditCard?: {
          cardNumber: string;
          expirationDate: string;
          cardCode: string;
        };
        opaqueData?: {
          dataDescriptor: string;
          dataValue: string;
        };
      };
      order?: {
        invoiceNumber: string;
        description: string;
      };
      customer?: {
        email?: string;
      };
    };
  };
}

export interface AuthorizeNetResponse {
  transactionResponse?: {
    responseCode: string;
    authCode: string;
    avsResultCode: string;
    cvvResultCode: string;
    cavvResultCode: string;
    transId: string;
    refTransID: string;
    transHash: string;
    testRequest: string;
    accountNumber: string;
    accountType: string;
    messages: Array<{
      code: string;
      description: string;
    }>;
    errors?: Array<{
      errorCode: string;
      errorText: string;
    }>;
  };
  messages: {
    resultCode: string;
    message: Array<{
      code: string;
      text: string;
    }>;
  };
}

// ============================================
// PAYMENT SERVICE CLASS
// ============================================

export class PaymentService {
  private authorizeNetApiUrl: string;
  private authorizeNetApiLoginId: string;
  private authorizeNetTransactionKey: string;
  private cloverApiUrl: string;
  private cloverAccessToken: string;
  private ingenicoApiUrl: string;
  private ingenicoApiKey: string;

  constructor() {
    // Authorize.Net Configuration
    const environment = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox';
    this.authorizeNetApiUrl = environment === 'production'
      ? 'https://api.authorize.net/xml/v1/request.api'
      : 'https://apitest.authorize.net/xml/v1/request.api';
    
    this.authorizeNetApiLoginId = process.env.AUTHORIZENET_API_LOGIN_ID || '';
    this.authorizeNetTransactionKey = process.env.AUTHORIZENET_TRANSACTION_KEY || '';

    // Clover Configuration
    const cloverEnvironment = process.env.CLOVER_ENVIRONMENT || 'sandbox';
    this.cloverApiUrl = cloverEnvironment === 'production'
      ? 'https://api.clover.com'
      : 'https://sandbox.dev.clover.com';
    this.cloverAccessToken = process.env.CLOVER_ACCESS_TOKEN || '';

    // Ingenico Configuration
    const ingenicoEnvironment = process.env.INGENICO_ENVIRONMENT || 'sandbox';
    this.ingenicoApiUrl = ingenicoEnvironment === 'production'
      ? 'https://payment.api.ingenico.com'
      : 'https://payment.api-sandbox.ingenico.com';
    this.ingenicoApiKey = process.env.INGENICO_API_KEY || '';
  }

  /**
   * Process payment charge
   */
  async charge(input: ChargeInput) {
    try {
      logger.info(`Processing payment for order ${input.orderId}, Amount: $${input.amount}`);

      let paymentResult;

      switch (input.paymentMethod) {
        case PaymentMethod.CREDIT_CARD:
        case PaymentMethod.DEBIT_CARD:
          paymentResult = await this.chargeAuthorizeNet(input);
          break;

        case PaymentMethod.TERMINAL:
          if (input.terminalId?.startsWith('clover')) {
            paymentResult = await this.chargeClover(input);
          } else {
            paymentResult = await this.chargeIngenico(input);
          }
          break;

        case PaymentMethod.CASH:
          paymentResult = await this.processCashPayment(input);
          break;

        default:
          throw new Error(`Unsupported payment method: ${input.paymentMethod}`);
      }

      // Save payment record to database
      const payment = await prisma.payment.create({
        data: {
          orderId: input.orderId,
          paymentMethod: input.paymentMethod,
          provider: paymentResult.provider,
          amount: input.amount,
          status: paymentResult.status,
          transactionId: paymentResult.transactionId,
          authCode: paymentResult.authCode,
          cardLast4: paymentResult.cardLast4,
          cardBrand: paymentResult.cardBrand,
          cardToken: paymentResult.cardToken,
          metadata: paymentResult.metadata,
          processedAt: new Date()
        }
      });

      // Update order payment status
      await prisma.order.update({
        where: { id: input.orderId },
        data: {
          paymentStatus: paymentResult.status === PaymentStatus.PAID
            ? PaymentStatus.PAID
            : PaymentStatus.FAILED
        }
      });

      logger.info(`Payment processed successfully: ${payment.id}`);

      return payment;
    } catch (error) {
      logger.error('Error processing payment:', error);
      
      // Record failed payment attempt
      await prisma.payment.create({
        data: {
          orderId: input.orderId,
          paymentMethod: input.paymentMethod,
          provider: 'unknown',
          amount: input.amount,
          status: PaymentStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          processedAt: new Date()
        }
      });

      throw error;
    }
  }

  /**
   * Authorize.Net payment processing
   */
  private async chargeAuthorizeNet(input: ChargeInput) {
    try {
      const expirationDate = input.expiryMonth && input.expiryYear
        ? `${input.expiryYear}-${input.expiryMonth.padStart(2, '0')}`
        : '';

      const requestBody: AuthorizeNetRequest = {
        createTransactionRequest: {
          merchantAuthentication: {
            name: this.authorizeNetApiLoginId,
            transactionKey: this.authorizeNetTransactionKey
          },
          refId: input.orderId,
          transactionRequest: {
            transactionType: 'authCaptureTransaction',
            amount: input.amount.toFixed(2),
            payment: input.cardToken
              ? {
                  opaqueData: {
                    dataDescriptor: 'COMMON.ACCEPT.INAPP.PAYMENT',
                    dataValue: input.cardToken
                  }
                }
              : {
                  creditCard: {
                    cardNumber: input.cardNumber!,
                    expirationDate: expirationDate,
                    cardCode: input.cvv!
                  }
                },
            order: {
              invoiceNumber: input.orderId,
              description: 'Restaurant Order'
            }
          }
        }
      };

      const response = await axios.post<AuthorizeNetResponse>(
        this.authorizeNetApiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const transactionResponse = response.data.transactionResponse;

      if (!transactionResponse) {
        throw new Error('No transaction response from Authorize.Net');
      }

      // Response code "1" = Approved
      if (transactionResponse.responseCode === '1') {
        return {
          provider: 'authorizenet',
          status: PaymentStatus.PAID,
          transactionId: transactionResponse.transId,
          authCode: transactionResponse.authCode,
          cardLast4: transactionResponse.accountNumber?.slice(-4),
          cardBrand: this.detectCardBrand(input.cardNumber || ''),
          cardToken: input.cardToken,
          metadata: {
            avsResultCode: transactionResponse.avsResultCode,
            cvvResultCode: transactionResponse.cvvResultCode,
            accountType: transactionResponse.accountType
          }
        };
      } else {
        const errorMessage = transactionResponse.errors
          ? transactionResponse.errors[0].errorText
          : transactionResponse.messages?.[0]?.description || 'Transaction declined';

        throw new Error(`Authorize.Net transaction declined: ${errorMessage}`);
      }
    } catch (error) {
      logger.error('Authorize.Net payment error:', error);
      throw error;
    }
  }

  /**
   * Clover terminal payment processing
   */
  private async chargeClover(input: ChargeInput) {
    try {
      const response = await axios.post(
        `${this.cloverApiUrl}/v1/payments`,
        {
          amount: Math.round(input.amount * 100), // Convert to cents
          currency: 'usd',
          source: input.terminalId,
          orderId: input.orderId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.cloverAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        provider: 'clover',
        status: PaymentStatus.PAID,
        transactionId: response.data.id,
        authCode: response.data.authCode,
        cardLast4: response.data.cardTransaction?.last4,
        cardBrand: response.data.cardTransaction?.cardType,
        cardToken: response.data.source?.id,
        metadata: response.data
      };
    } catch (error) {
      logger.error('Clover payment error:', error);
      throw error;
    }
  }

  /**
   * Ingenico terminal payment processing
   */
  private async chargeIngenico(input: ChargeInput) {
    try {
      const response = await axios.post(
        `${this.ingenicoApiUrl}/v1/payments`,
        {
          order: {
            amountOfMoney: {
              amount: Math.round(input.amount * 100), // Convert to cents
              currencyCode: 'USD'
            },
            references: {
              merchantReference: input.orderId
            }
          },
          cardPaymentMethodSpecificInput: {
            terminalId: input.terminalId
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.ingenicoApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        provider: 'ingenico',
        status: PaymentStatus.PAID,
        transactionId: response.data.id,
        authCode: response.data.paymentOutput?.cardPaymentMethodSpecificOutput?.authorisationCode,
        cardLast4: response.data.paymentOutput?.cardPaymentMethodSpecificOutput?.card?.cardNumber,
        cardBrand: response.data.paymentOutput?.cardPaymentMethodSpecificOutput?.card?.cardType,
        cardToken: null,
        metadata: response.data
      };
    } catch (error) {
      logger.error('Ingenico payment error:', error);
      throw error;
    }
  }

  /**
   * Process cash payment (for POS)
   */
  private async processCashPayment(input: ChargeInput) {
    return {
      provider: 'cash',
      status: PaymentStatus.PAID,
      transactionId: `CASH-${Date.now()}`,
      authCode: 'CASH',
      cardLast4: null,
      cardBrand: null,
      cardToken: null,
      metadata: { paymentMethod: 'cash' }
    };
  }

  /**
   * Process refund
   */
  async refund(paymentId: string, amount: number, reason: string, processedBy?: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== PaymentStatus.PAID) {
        throw new Error('Can only refund paid transactions');
      }

      let refundResult;

      switch (payment.provider) {
        case 'authorizenet':
          refundResult = await this.refundAuthorizeNet(payment.transactionId!, amount, payment.cardLast4!);
          break;

        case 'clover':
          refundResult = await this.refundClover(payment.transactionId!, amount);
          break;

        case 'ingenico':
          refundResult = await this.refundIngenico(payment.transactionId!, amount);
          break;

        case 'cash':
          refundResult = { transactionId: `REFUND-CASH-${Date.now()}`, status: 'completed' };
          break;

        default:
          throw new Error(`Refunds not supported for provider: ${payment.provider}`);
      }

      // Create refund record
      const refund = await prisma.refund.create({
        data: {
          paymentId: payment.id,
          amount,
          reason,
          status: refundResult.status,
          transactionId: refundResult.transactionId,
          processedBy,
          processedAt: new Date()
        }
      });

      // Update payment status
      const totalRefunded = await prisma.refund.aggregate({
        where: { paymentId: payment.id, status: 'completed' },
        _sum: { amount: true }
      });

      const totalRefundedAmount = parseFloat(totalRefunded._sum.amount?.toString() || '0');
      const paymentAmount = parseFloat(payment.amount.toString());

      if (totalRefundedAmount >= paymentAmount) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.REFUNDED }
        });
      } else {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.PARTIALLY_REFUNDED }
        });
      }

      logger.info(`Refund processed: ${refund.id} for payment ${payment.id}`);

      return refund;
    } catch (error) {
      logger.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Authorize.Net refund
   */
  private async refundAuthorizeNet(transactionId: string, amount: number, cardLast4: string) {
    try {
      const requestBody = {
        createTransactionRequest: {
          merchantAuthentication: {
            name: this.authorizeNetApiLoginId,
            transactionKey: this.authorizeNetTransactionKey
          },
          transactionRequest: {
            transactionType: 'refundTransaction',
            amount: amount.toFixed(2),
            payment: {
              creditCard: {
                cardNumber: cardLast4,
                expirationDate: 'XXXX'
              }
            },
            refTransId: transactionId
          }
        }
      };

      const response = await axios.post<AuthorizeNetResponse>(
        this.authorizeNetApiUrl,
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const transactionResponse = response.data.transactionResponse;

      if (transactionResponse?.responseCode === '1') {
        return {
          transactionId: transactionResponse.transId,
          status: 'completed'
        };
      } else {
        throw new Error('Refund transaction declined');
      }
    } catch (error) {
      logger.error('Authorize.Net refund error:', error);
      throw error;
    }
  }

  /**
   * Clover refund
   */
  private async refundClover(transactionId: string, amount: number) {
    try {
      const response = await axios.post(
        `${this.cloverApiUrl}/v1/refunds`,
        {
          charge: transactionId,
          amount: Math.round(amount * 100)
        },
        {
          headers: {
            'Authorization': `Bearer ${this.cloverAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        transactionId: response.data.id,
        status: 'completed'
      };
    } catch (error) {
      logger.error('Clover refund error:', error);
      throw error;
    }
  }

  /**
   * Ingenico refund
   */
  private async refundIngenico(transactionId: string, amount: number) {
    try {
      const response = await axios.post(
        `${this.ingenicoApiUrl}/v1/payments/${transactionId}/refund`,
        {
          amountOfMoney: {
            amount: Math.round(amount * 100),
            currencyCode: 'USD'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.ingenicoApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        transactionId: response.data.id,
        status: 'completed'
      };
    } catch (error) {
      logger.error('Ingenico refund error:', error);
      throw error;
    }
  }

  /**
   * Detect card brand from card number
   */
  private detectCardBrand(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '');

    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';

    return 'Unknown';
  }

  /**
   * Void/Cancel a payment (before settlement)
   */
  async voidPayment(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment || !payment.transactionId) {
        throw new Error('Payment not found');
      }

      // Void transaction with provider
      if (payment.provider === 'authorizenet') {
        await this.voidAuthorizeNet(payment.transactionId);
      }

      // Update payment status
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED }
      });

      logger.info(`Payment voided: ${paymentId}`);

      return { success: true };
    } catch (error) {
      logger.error('Error voiding payment:', error);
      throw error;
    }
  }

  /**
   * Void transaction in Authorize.Net
   */
  private async voidAuthorizeNet(transactionId: string) {
    const requestBody = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: this.authorizeNetApiLoginId,
          transactionKey: this.authorizeNetTransactionKey
        },
        transactionRequest: {
          transactionType: 'voidTransaction',
          refTransId: transactionId
        }
      }
    };

    await axios.post(this.authorizeNetApiUrl, requestBody, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default new PaymentService();

