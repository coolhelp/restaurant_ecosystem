import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Placeholder routes - to be implemented
router.get('/assigned', (req, res) => res.json({ message: 'Get assigned deliveries' }));
router.put('/:id/status', (req, res) => res.json({ message: 'Update delivery status' }));

export default router;

