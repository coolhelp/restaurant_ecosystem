import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();

export class MenuController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.query;

      const categories = await prisma.category.findMany({
        where: {
          isActive: true,
          ...(locationId && { locationId: locationId as string })
        },
        include: {
          items: {
            where: { isActive: true, isAvailable: true },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      res.json({
        status: 'success',
        data: categories
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          items: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });

      if (!category) {
        throw new AppError('Category not found', 404);
      }

      res.json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async getItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, featured } = req.query;

      const items = await prisma.item.findMany({
        where: {
          isActive: true,
          isAvailable: true,
          ...(categoryId && { categoryId: categoryId as string }),
          ...(featured === 'true' && { isFeatured: true })
        },
        include: {
          category: true,
          modifierGroups: {
            include: {
              modifierGroup: {
                include: {
                  modifiers: {
                    where: { isAvailable: true },
                    orderBy: { sortOrder: 'asc' }
                  }
                }
              }
            }
          }
        },
        orderBy: { sortOrder: 'asc' }
      });

      res.json({
        status: 'success',
        data: items
      });
    } catch (error) {
      next(error);
    }
  }

  async getItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const item = await prisma.item.findUnique({
        where: { id },
        include: {
          category: true,
          modifierGroups: {
            include: {
              modifierGroup: {
                include: {
                  modifiers: {
                    where: { isAvailable: true },
                    orderBy: { sortOrder: 'asc' }
                  }
                }
              }
            }
          }
        }
      });

      if (!item) {
        throw new AppError('Item not found', 404);
      }

      res.json({
        status: 'success',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await prisma.category.create({
        data: req.body
      });

      res.status(201).json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await prisma.category.update({
        where: { id },
        data: req.body
      });

      res.json({
        status: 'success',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.category.update({
        where: { id },
        data: { isActive: false }
      });

      res.json({
        status: 'success',
        message: 'Category deleted'
      });
    } catch (error) {
      next(error);
    }
  }

  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await prisma.item.create({
        data: req.body
      });

      res.status(201).json({
        status: 'success',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const item = await prisma.item.update({
        where: { id },
        data: req.body
      });

      res.json({
        status: 'success',
        data: item
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.item.update({
        where: { id },
        data: { isActive: false }
      });

      res.json({
        status: 'success',
        message: 'Item deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

