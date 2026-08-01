import { UserRole } from 'prisma/generated/prisma/client';
import z from 'zod';

export const UserEntitySchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: z.nativeEnum(UserRole),
  nome: z.string(),
  cro: z.string().nullable(),
  createdAt: z.date(),
});

export type UserEntity = z.infer<typeof UserEntitySchema>;