import apiClient from './client';

export const authService = {
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },

  register: (data: any) => {
    return apiClient.post('/auth/register', data);
  },

  logout: () => {
    return apiClient.post('/auth/logout');
  },

  refreshToken: (refreshToken: string) => {
    return apiClient.post('/auth/refresh', { refreshToken });
  },
};

