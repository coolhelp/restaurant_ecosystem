import { Router } from 'express';
import { LocationController } from '../controllers/location.controller';

const router = Router();
const locationController = new LocationController();

router.get('/', locationController.getLocations);
router.get('/:id', locationController.getLocationById);

export default router;

