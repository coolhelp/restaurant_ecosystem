import { Server as SocketIO } from 'socket.io';
import { logger } from '../utils/logger';

export const initializeSocketHandlers = (io: SocketIO) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join order tracking room
    socket.on('join:order', (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.info(`Client ${socket.id} joined order room: ${orderId}`);
    });

    // Join location room
    socket.on('join:location', (locationId: string) => {
      socket.join(`location:${locationId}`);
      logger.info(`Client ${socket.id} joined location room: ${locationId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO handlers initialized');
};

// Helper to emit order updates
export const emitOrderUpdate = (io: SocketIO, orderId: string, data: any) => {
  io.to(`order:${orderId}`).emit('order:update', data);
};

// Helper to emit location updates
export const emitLocationUpdate = (io: SocketIO, locationId: string, data: any) => {
  io.to(`location:${locationId}`).emit('location:update', data);
};

