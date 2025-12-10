import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Placeholder routes
router.get('/', (req, res) => res.json({ message: 'Get notifications' }));
router.post('/send', (req, res) => res.json({ message: 'Send notification' }));

export default router;

