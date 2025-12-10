import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('MANAGER', 'ADMIN'));

// Placeholder routes
router.get('/sales', (req, res) => res.json({ message: 'Sales report' }));
router.get('/orders', (req, res) => res.json({ message: 'Orders report' }));

export default router;

