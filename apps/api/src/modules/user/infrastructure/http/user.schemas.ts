import { z } from 'zod';
import { registerSchema } from '../../../auth/infrastructure/http/auth.schemas.js';

export const userIdParamSchema = z.object({
  id: z.string().min(1, 'El identificador de usuario es requerido'),
});

export const listUsersQuerySchema = z.object({
  rut: z.string().optional(),
});

export const createUserSchema = registerSchema;
