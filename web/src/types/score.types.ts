import { z } from 'zod';

export const UserScoreSchema = z.object({
  rut: z.string(),
  score: z.number(),
  date: z.string(),
});
export type UserScore = z.infer<typeof UserScoreSchema>;

export const ScoreResponseSchema = z.object({
  status: z.literal('success'),
  data: UserScoreSchema,
});
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;

export const RutInputSchema = z.object({
  rut: z
    .string()
    .trim()
    .min(1, 'El RUT es requerido')
    .regex(/^[0-9]+-[0-9kK]$|^[0-9]{1,2}(\.[0-9]{3}){2}-[0-9kK]$/, 'Formato de RUT inválido (ej: 12.345.678-9 o 12345678-9)'),
});
export type RutInput = z.infer<typeof RutInputSchema>;
