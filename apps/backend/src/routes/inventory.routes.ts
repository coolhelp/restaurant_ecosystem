import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('MANAGER', 'ADMIN'));

// Placeholder routes - to be implemented
router.get('/', (req, res) => res.json({ message: 'Get inventory' }));
router.post('/', (req, res) => res.json({ message: 'Create inventory item' }));
router.put('/:id', (req, res) => res.json({ message: 'Update inventory' }));

export default router;

