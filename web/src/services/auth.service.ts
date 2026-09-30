import { apiClient } from './api.client';
import { AuthResponseSchema, RefreshResponseSchema, SafeUserSchema } from '@/types/auth.types';
import type { LoginInput, SafeUser } from '@/types/auth.types';
import { z } from 'zod';

export const authService = {
  login: async (credentials: LoginInput) => {
    const response = await apiClient.post('/auth/login', credentials);
    const parsed = AuthResponseSchema.parse(response.data);
    return parsed.data;
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    const parsed = RefreshResponseSchema.parse(response.data);
    return parsed.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getUserProfile: async (userId: string): Promise<SafeUser> => {
    const response = await apiClient.get(`/users/${userId}`);
    const userSchema = z.object({
      status: z.literal('success'),
      data: SafeUserSchema,
    });
    const parsed = userSchema.parse(response.data);
    return parsed.data;
  },
};
