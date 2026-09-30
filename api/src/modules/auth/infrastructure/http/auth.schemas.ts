import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido').optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  email: z.string().email('Formato de correo electrónico inválido').optional(),
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  rut: z.string().min(8, 'El RUT debe tener un formato válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'USER']).optional(),
});
