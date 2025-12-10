import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const menuController = new MenuController();

// Public routes
router.get('/categories', menuController.getCategories);
router.get('/categories/:id', menuController.getCategoryById);
router.get('/items', menuController.getItems);
router.get('/items/:id', menuController.getItemById);

// Protected routes
router.post('/categories', authenticate, menuController.createCategory);
router.put('/categories/:id', authenticate, menuController.updateCategory);
router.delete('/categories/:id', authenticate, menuController.deleteCategory);

router.post('/items', authenticate, menuController.createItem);
router.put('/items/:id', authenticate, menuController.updateItem);
router.delete('/items/:id', authenticate, menuController.deleteItem);

export default router;

