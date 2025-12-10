/**
 * Loyalty Service
 * 
 * Handles all loyalty program business logic including:
 * - Points earning calculations
 * - Points redemption
 * - Balance management
 * - Tier progression
 * - Transaction history
 */

import { PrismaClient, LoyaltyTransactionType } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface LoyaltyRule {
  type: 'percentage' | 'fixed' | 'threshold';
  value: number;
  minSpend?: number;
}

export interface EarnPointsInput {
  userId: string;
  orderId: string;
  orderAmount: number;
}

export interface RedeemPointsInput {
  userId: string;
  orderId: string;
  points: number;
}

export class LoyaltyService {
  /**
   * Get or create loyalty account for user
   */
  async getOrCreateAccount(userId: string) {
    try {
      let account = await prisma.loyaltyAccount.findUnique({
        where: { userId }
      });

      if (!account) {
        account = await prisma.loyaltyAccount.create({
          data: {
            userId,
            pointsBalance: 0,
            lifetimePoints: 0,
            tier: 'bronze'
          }
        });
        logger.info(`Created new loyalty account for user ${userId}`);
      }

      return account;
    } catch (error) {
      logger.error('Error getting/creating loyalty account:', error);
      throw error;
    }
  }

  /**
   * Calculate points earned based on order amount and active rules
   */
  async calculatePointsEarned(orderAmount: number): Promise<number> {
    try {
      // Get active loyalty rules
      const rules = await prisma.loyaltyRule.findMany({
        where: { isActive: true },
        orderBy: { priority: 'desc' }
      });

      if (rules.length === 0) {
        // Default rule: 1 point per dollar spent
        return Math.floor(orderAmount);
      }

      let totalPoints = 0;

      for (const rule of rules) {
        const ruleValue = parseFloat(rule.value.toString());
        const minSpend = rule.minSpend ? parseFloat(rule.minSpend.toString()) : 0;

        // Skip if order doesn't meet minimum spend
        if (orderAmount < minSpend) {
          continue;
        }

        switch (rule.type) {
          case 'percentage':
            // Earn percentage of amount as points (e.g., 5% = 5 points per $100)
            totalPoints += Math.floor((orderAmount * ruleValue) / 100);
            break;

          case 'fixed':
            // Earn fixed points per dollar (e.g., 2 points per $1)
            totalPoints += Math.floor(orderAmount * ruleValue);
            break;

          case 'threshold':
            // Earn bonus points if threshold is met (e.g., 50 bonus points for orders over $50)
            if (orderAmount >= ruleValue) {
              totalPoints += Math.floor(ruleValue);
            }
            break;

          default:
            logger.warn(`Unknown loyalty rule type: ${rule.type}`);
        }
      }

      return Math.max(0, totalPoints);
    } catch (error) {
      logger.error('Error calculating points earned:', error);
      throw error;
    }
  }

  /**
   * Award loyalty points for an order
   */
  async earnPoints(input: EarnPointsInput) {
    const { userId, orderId, orderAmount } = input;

    try {
      // Get or create account
      const account = await this.getOrCreateAccount(userId);

      // Calculate points to award
      const pointsToAward = await this.calculatePointsEarned(orderAmount);

      if (pointsToAward <= 0) {
        logger.info(`No points to award for order ${orderId}`);
        return account;
      }

      // Update account and create transaction in a single transaction
      const updatedAccount = await prisma.$transaction(async (tx) => {
        // Create loyalty transaction
        await tx.loyaltyTransaction.create({
          data: {
            accountId: account.id,
            type: LoyaltyTransactionType.EARN,
            points: pointsToAward,
            orderId,
            description: `Earned ${pointsToAward} points from order`
          }
        });

        // Update account balance
        const updated = await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            pointsBalance: { increment: pointsToAward },
            lifetimePoints: { increment: pointsToAward }
          }
        });

        // Check and update tier if necessary
        await this.updateTier(tx, updated.id, updated.lifetimePoints);

        return updated;
      });

      logger.info(`User ${userId} earned ${pointsToAward} loyalty points from order ${orderId}`);

      return updatedAccount;
    } catch (error) {
      logger.error('Error earning loyalty points:', error);
      throw error;
    }
  }

  /**
   * Redeem loyalty points for discount
   */
  async redeemPoints(input: RedeemPointsInput) {
    const { userId, orderId, points } = input;

    try {
      // Validate points amount
      if (points <= 0) {
        throw new Error('Points to redeem must be greater than 0');
      }

      // Get account
      const account = await this.getOrCreateAccount(userId);

      // Check if user has enough points
      if (account.pointsBalance < points) {
        throw new Error(`Insufficient points. Available: ${account.pointsBalance}, Requested: ${points}`);
      }

      // Calculate discount amount (default: 1 point = $0.01)
      const discountAmount = points / 100;

      // Update account and create transaction
      const updatedAccount = await prisma.$transaction(async (tx) => {
        // Create loyalty transaction (negative points for redemption)
        await tx.loyaltyTransaction.create({
          data: {
            accountId: account.id,
            type: LoyaltyTransactionType.REDEEM,
            points: -points,
            orderId,
            description: `Redeemed ${points} points for $${discountAmount.toFixed(2)} discount`
          }
        });

        // Update account balance
        return await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            pointsBalance: { decrement: points }
          }
        });
      });

      logger.info(`User ${userId} redeemed ${points} loyalty points for order ${orderId}`);

      return {
        account: updatedAccount,
        discountAmount
      };
    } catch (error) {
      logger.error('Error redeeming loyalty points:', error);
      throw error;
    }
  }

  /**
   * Get loyalty account balance and transaction history
   */
  async getAccountDetails(userId: string) {
    try {
      const account = await this.getOrCreateAccount(userId);

      const transactions = await prisma.loyaltyTransaction.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: 'desc' },
        take: 50 // Last 50 transactions
      });

      return {
        ...account,
        transactions,
        pointsValue: (account.pointsBalance / 100).toFixed(2) // Convert to dollar value
      };
    } catch (error) {
      logger.error('Error getting account details:', error);
      throw error;
    }
  }

  /**
   * Update loyalty tier based on lifetime points
   */
  private async updateTier(tx: any, accountId: string, lifetimePoints: number) {
    let newTier = 'bronze';

    // Define tier thresholds
    if (lifetimePoints >= 10000) {
      newTier = 'platinum';
    } else if (lifetimePoints >= 5000) {
      newTier = 'gold';
    } else if (lifetimePoints >= 2000) {
      newTier = 'silver';
    }

    // Update tier if changed
    await tx.loyaltyAccount.updateMany({
      where: {
        id: accountId,
        tier: { not: newTier }
      },
      data: { tier: newTier }
    });
  }

  /**
   * Award bonus points (for promotions, referrals, etc.)
   */
  async awardBonusPoints(userId: string, points: number, description: string) {
    try {
      const account = await this.getOrCreateAccount(userId);

      const updatedAccount = await prisma.$transaction(async (tx) => {
        await tx.loyaltyTransaction.create({
          data: {
            accountId: account.id,
            type: LoyaltyTransactionType.BONUS,
            points,
            description
          }
        });

        return await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            pointsBalance: { increment: points },
            lifetimePoints: { increment: points }
          }
        });
      });

      logger.info(`Awarded ${points} bonus points to user ${userId}: ${description}`);

      return updatedAccount;
    } catch (error) {
      logger.error('Error awarding bonus points:', error);
      throw error;
    }
  }

  /**
   * Adjust points (admin function for corrections)
   */
  async adjustPoints(userId: string, points: number, reason: string) {
    try {
      const account = await this.getOrCreateAccount(userId);

      const updatedAccount = await prisma.$transaction(async (tx) => {
        await tx.loyaltyTransaction.create({
          data: {
            accountId: account.id,
            type: LoyaltyTransactionType.ADJUSTMENT,
            points,
            description: `Manual adjustment: ${reason}`
          }
        });

        return await tx.loyaltyAccount.update({
          where: { id: account.id },
          data: {
            pointsBalance: { increment: points },
            lifetimePoints: { increment: Math.max(0, points) } // Only add to lifetime if positive
          }
        });
      });

      logger.info(`Adjusted ${points} points for user ${userId}: ${reason}`);

      return updatedAccount;
    } catch (error) {
      logger.error('Error adjusting points:', error);
      throw error;
    }
  }

  /**
   * Calculate discount amount from points
   */
  calculateDiscountFromPoints(points: number): number {
    // Default conversion rate: 100 points = $1.00
    return points / 100;
  }

  /**
   * Calculate points needed for a specific discount amount
   */
  calculatePointsNeededForDiscount(discountAmount: number): number {
    // Default conversion rate: $1.00 = 100 points
    return Math.ceil(discountAmount * 100);
  }

  /**
   * Get loyalty program statistics
   */
  async getLoyaltyStats() {
    try {
      const stats = await prisma.loyaltyAccount.aggregate({
        _count: true,
        _sum: {
          pointsBalance: true,
          lifetimePoints: true
        },
        _avg: {
          pointsBalance: true,
          lifetimePoints: true
        }
      });

      const tierCounts = await prisma.loyaltyAccount.groupBy({
        by: ['tier'],
        _count: true
      });

      return {
        totalAccounts: stats._count,
        totalPointsInCirculation: stats._sum.pointsBalance || 0,
        totalLifetimePoints: stats._sum.lifetimePoints || 0,
        averageBalance: Math.round(stats._avg.pointsBalance || 0),
        averageLifetimePoints: Math.round(stats._avg.lifetimePoints || 0),
        tierDistribution: tierCounts
      };
    } catch (error) {
      logger.error('Error getting loyalty stats:', error);
      throw error;
    }
  }

  /**
   * Expire old points (run as scheduled job)
   */
  async expirePoints() {
    try {
      // Find transactions older than expiration period (e.g., 1 year)
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 1);

      const expiredTransactions = await prisma.loyaltyTransaction.findMany({
        where: {
          type: LoyaltyTransactionType.EARN,
          createdAt: { lte: expirationDate },
          expiresAt: { lte: new Date() }
        },
        include: { account: true }
      });

      for (const transaction of expiredTransactions) {
        await prisma.$transaction(async (tx) => {
          // Create expiration transaction
          await tx.loyaltyTransaction.create({
            data: {
              accountId: transaction.accountId,
              type: LoyaltyTransactionType.EXPIRATION,
              points: -transaction.points,
              description: `${transaction.points} points expired`
            }
          });

          // Deduct from balance
          await tx.loyaltyAccount.update({
            where: { id: transaction.accountId },
            data: {
              pointsBalance: { decrement: transaction.points }
            }
          });
        });
      }

      logger.info(`Expired ${expiredTransactions.length} loyalty point transactions`);

      return expiredTransactions.length;
    } catch (error) {
      logger.error('Error expiring points:', error);
      throw error;
    }
  }
}

export default new LoyaltyService();

