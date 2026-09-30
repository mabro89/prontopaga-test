import { apiClient } from './api.client';
import { ScoreResponseSchema } from '@/types/score.types';
import type { UserScore } from '@/types/score.types';

export const scoreService = {
  getScoreByRut: async (rut: string): Promise<UserScore> => {
    const response = await apiClient.get('/users', {
      params: { rut },
    });
    const parsed = ScoreResponseSchema.parse(response.data);
    return parsed.data;
  },
};
