import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import loyaltyService from '../services/loyalty.service';

export class LoyaltyController {
  async getAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const accountDetails = await loyaltyService.getAccountDetails(userId);

      res.json({
        status: 'success',
        data: accountDetails
      });
    } catch (error) {
      next(error);
    }
  }

  async earnPoints(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, orderAmount } = req.body;
      const userId = req.user!.id;

      const account = await loyaltyService.earnPoints({
        userId,
        orderId,
        orderAmount
      });

      res.json({
        status: 'success',
        data: account
      });
    } catch (error) {
      next(error);
    }
  }

  async redeemPoints(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId, points } = req.body;
      const userId = req.user!.id;

      const result = await loyaltyService.redeemPoints({
        userId,
        orderId,
        points
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const accountDetails = await loyaltyService.getAccountDetails(userId);

      res.json({
        status: 'success',
        data: accountDetails.transactions
      });
    } catch (error) {
      next(error);
    }
  }

  async awardBonus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, points, description } = req.body;

      const account = await loyaltyService.awardBonusPoints(userId, points, description);

      res.json({
        status: 'success',
        data: account
      });
    } catch (error) {
      next(error);
    }
  }
}

