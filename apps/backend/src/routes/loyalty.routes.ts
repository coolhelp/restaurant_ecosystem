import { Router } from 'express';
import { LoyaltyController } from '../controllers/loyalty.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const loyaltyController = new LoyaltyController();

router.use(authenticate);

router.get('/account', loyaltyController.getAccount);
router.post('/earn', loyaltyController.earnPoints);
router.post('/redeem', loyaltyController.redeemPoints);
router.get('/transactions', loyaltyController.getTransactions);
router.post('/bonus', loyaltyController.awardBonus);

export default router;

