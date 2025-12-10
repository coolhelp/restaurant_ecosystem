import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class LocationController {
  async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await prisma.location.findMany({
        where: { isActive: true }
      });

      res.json({
        status: 'success',
        data: locations
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const location = await prisma.location.findUnique({
        where: { id },
        include: {
          categories: {
            where: { isActive: true },
            include: {
              items: {
                where: { isActive: true }
              }
            }
          }
        }
      });

      if (!location) {
        throw new AppError('Location not found', 404);
      }

      res.json({
        status: 'success',
        data: location
      });
    } catch (error) {
      next(error);
    }
  }
}

