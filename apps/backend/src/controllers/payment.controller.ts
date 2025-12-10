import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import paymentService from '../services/payment.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PaymentController {
  async charge(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.charge(req.body);

      res.json({
        status: 'success',
        data: payment
      });
    } catch (error) {
      next(error);
    }
  }

  async refund(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { paymentId, amount, reason } = req.body;
      const userId = req.user!.id;

      const refund = await paymentService.refund(paymentId, amount, reason, userId);

      res.json({
        status: 'success',
        data: refund
      });
    } catch (error) {
      next(error);
    }
  }

  async voidPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const result = await paymentService.voidPayment(id);

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentsByOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const payments = await prisma.payment.findMany({
        where: { orderId },
        include: {
          refunds: true
        }
      });

      res.json({
        status: 'success',
        data: payments
      });
    } catch (error) {
      next(error);
    }
  }
}

