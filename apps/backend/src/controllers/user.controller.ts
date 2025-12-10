import { Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          customer: true,
          loyaltyAccount: true
        }
      });

      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { firstName, lastName, phone } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { firstName, lastName, phone },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true
        }
      });

      res.json({
        status: 'success',
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: 'desc' }
      });

      res.json({
        status: 'success',
        data: addresses
      });
    } catch (error) {
      next(error);
    }
  }

  async createAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const address = await prisma.address.create({
        data: {
          userId,
          ...req.body
        }
      });

      res.status(201).json({
        status: 'success',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const address = await prisma.address.update({
        where: { id },
        data: req.body
      });

      res.json({
        status: 'success',
        data: address
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.address.delete({
        where: { id }
      });

      res.json({
        status: 'success',
        message: 'Address deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

