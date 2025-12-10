import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('MANAGER', 'ADMIN'));

// Placeholder routes
router.get('/', (req, res) => res.json({ message: 'Get printers' }));
router.post('/test', (req, res) => res.json({ message: 'Test printer' }));

export default router;

