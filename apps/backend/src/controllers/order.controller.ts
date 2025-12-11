import { Response, NextFunction } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const {
        locationId,
        orderType,
        items,
        tableId,
        addressId,
        tipAmount,
        specialInstructions
      } = req.body;

      // Calculate totals
      let subtotal = 0;
      for (const item of items) {
        subtotal += item.unitPrice * item.quantity;
        if (item.modifiers) {
          for (const mod of item.modifiers) {
            subtotal += mod.price * mod.quantity;
          }
        }
      }

      const taxRate = 0.08; // 8% tax
      const taxAmount = subtotal * taxRate;
      const total = subtotal + taxAmount + (tipAmount || 0);

      // Generate order number
      const orderCount = await prisma.order.count();
      const orderNumber = `ORD-${Date.now()}-${orderCount + 1}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId,
          locationId,
          orderType,
          orderStatus: OrderStatus.PENDING,
          tableId,
          addressId,
          subtotal,
          taxAmount,
          tipAmount: tipAmount || 0,
          deliveryFee: 0,
          discountAmount: 0,
          loyaltyDiscount: 0,
          total,
          specialInstructions,
          items: {
            create: items.map((item: any) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.unitPrice * item.quantity,
              specialInstructions: item.specialInstructions,
              modifiers: item.modifiers ? {
                create: item.modifiers.map((mod: any) => ({
                  modifierId: mod.modifierId,
                  quantity: mod.quantity,
                  price: mod.price
                }))
              } : undefined
            }))
          }
        },
        include: {
          items: {
            include: {
              item: true,
              modifiers: {
                include: {
                  modifier: true
                }
              }
            }
          },
          location: true
        }
      });

      logger.info(`Order created: ${order.orderNumber}`);

      res.status(201).json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const { locationId, status, orderType } = req.query;

      // For customers, only show their own orders
      // For staff/admin, show all orders (with optional filters)
      const orders = await prisma.order.findMany({
        where: {
          ...(userRole === 'CUSTOMER' && { userId }),
          ...(locationId && { locationId: locationId as string }),
          ...(status && { orderStatus: status as OrderStatus }),
          ...(orderType && { orderType: orderType as any })
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          items: {
            include: {
              item: true,
              modifiers: {
                include: {
                  modifier: true
                }
              }
            }
          },
          location: true
        },
        orderBy: { placedAt: 'desc' },
        take: 50
      });

      res.json({
        status: 'success',
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          items: {
            include: {
              item: true,
              modifiers: {
                include: {
                  modifier: true
                }
              }
            }
          },
          location: true,
          payments: true,
          delivery: true
        }
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: {
          orderStatus: status,
          ...(status === OrderStatus.CONFIRMED && { acceptedAt: new Date() }),
          ...(status === OrderStatus.READY && { readyAt: new Date() }),
          ...(status === OrderStatus.COMPLETED && { completedAt: new Date() }),
          ...(status === OrderStatus.CANCELLED && { cancelledAt: new Date() })
        }
      });

      // Create status history record
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status,
          notes,
          changedBy: req.user!.id
        }
      });

      logger.info(`Order ${order.orderNumber} status updated to ${status}`);

      res.json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: {
          orderStatus: OrderStatus.CANCELLED,
          cancelledAt: new Date()
        }
      });

      // Create status history
      await prisma.orderStatusHistory.create({
        data: {
          orderId: id,
          status: OrderStatus.CANCELLED,
          notes: reason,
          changedBy: req.user!.id
        }
      });

      logger.info(`Order ${order.orderNumber} cancelled`);

      res.json({
        status: 'success',
        data: order
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              item: true
            }
          },
          location: true
        },
        orderBy: { placedAt: 'desc' },
        take: 20
      });

      res.json({
        status: 'success',
        data: orders
      });
    } catch (error) {
      next(error);
    }
  }
}

