import { api } from './api';
import type { Item, Category } from '@/types/menu';
import type { Order, CreateOrderData } from '@/types/order';
import type { Address, CreateAddressData } from '@/types/address';
import type { User } from '@/types/auth';

// Menu Services
export const menuApi = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/menu/categories');
    return response.data.data || response.data;
  },

  getCategory: async (slug: string): Promise<Category> => {
    const response = await api.get(`/menu/categories/${slug}`);
    return response.data.data || response.data;
  },

  getItems: async (categoryId?: string): Promise<Item[]> => {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get('/menu/items', { params });
    return response.data.data || response.data;
  },

  getItem: async (slug: string): Promise<Item> => {
    const response = await api.get(`/menu/items/${slug}`);
    return response.data.data || response.data;
  },

  getFeaturedItems: async (): Promise<Item[]> => {
    const response = await api.get('/menu/items/featured');
    return response.data.data || response.data;
  },
};

// Order Services
export const orderApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data.data || response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data.data || response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data || response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data.data || response.data;
  },

  trackOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}/track`);
    return response.data.data || response.data;
  },
};

// Address Services
export const addressApi = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get('/users/addresses');
    return response.data.data || response.data;
  },

  getAddress: async (id: string): Promise<Address> => {
    const response = await api.get(`/users/addresses/${id}`);
    return response.data.data || response.data;
  },

  createAddress: async (data: CreateAddressData): Promise<Address> => {
    const response = await api.post('/users/addresses', data);
    return response.data.data || response.data;
  },

  updateAddress: async (id: string, data: Partial<CreateAddressData>): Promise<Address> => {
    const response = await api.put(`/users/addresses/${id}`, data);
    return response.data.data || response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/users/addresses/${id}`);
  },

  setDefaultAddress: async (id: string): Promise<Address> => {
    const response = await api.patch(`/users/addresses/${id}/default`);
    return response.data.data || response.data;
  },
};

// User Profile Services
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data.data || response.data;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<User> => {
    const response = await api.put('/users/profile', data);
    return response.data.data || response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    await api.post('/users/change-password', data);
  },
};

// Loyalty Services
export const loyaltyApi = {
  getAccount: async () => {
    const response = await api.get('/loyalty/account');
    return response.data.data || response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/loyalty/transactions');
    return response.data.data || response.data;
  },
};

// Location Services
export const locationApi = {
  getLocations: async () => {
    const response = await api.get('/locations');
    return response.data.data || response.data;
  },

  getLocation: async (id: string) => {
    const response = await api.get(`/locations/${id}`);
    return response.data.data || response.data;
  },

  getNearestLocation: async (latitude: number, longitude: number) => {
    const response = await api.get('/locations/nearest', {
      params: { latitude, longitude },
    });
    return response.data.data || response.data;
  },
};

// Notification Services
export const notificationApi = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data.data || response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data.data || response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data.data || response.data;
  },
};

