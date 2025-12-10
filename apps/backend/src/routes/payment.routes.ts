import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const paymentController = new PaymentController();

router.use(authenticate);

router.post('/charge', paymentController.charge);
router.post('/refund', paymentController.refund);
router.post('/void/:id', paymentController.voidPayment);
router.get('/order/:orderId', paymentController.getPaymentsByOrder);

export default router;

