import { z } from 'zod';

export const UserRoleSchema = z.enum(['ADMIN', 'USER']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const SafeUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  rut: z.string(),
  role: UserRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type SafeUser = z.infer<typeof SafeUserSchema>;

export const LoginInputSchema = z.object({
  email: z.string().trim().min(1, 'El correo es requerido').email('Formato de correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const AuthResponseSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    user: SafeUserSchema,
    accessToken: z.string(),
  }),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const RefreshResponseSchema = z.object({
  status: z.literal('success'),
  data: z.object({
    accessToken: z.string(),
  }),
});
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

export const JwtPayloadSchema = z.object({
  id: z.string(),
  role: UserRoleSchema,
  rut: z.string(),
  exp: z.number().optional(),
  iat: z.number().optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export interface ApiErrorResponse {
  status: 'error' | 'fail';
  message: string;
  errors?: Array<{ field: string; message: string }>;
}
