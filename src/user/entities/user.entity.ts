import { z } from 'zod';
import { LicencaEntitySchema } from '../../license/entities/licenca.entity.js';

export const UserEntitySchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  role: z.preprocess(
    (val) => val as string,
    z.enum(['admin', 'dentist']),
  ),
  nome: z.string(),
  cro: z.string().nullable(),
  licencas: z.array(LicencaEntitySchema),
  createdAt: z.date(),
});

export type UserEntity = z.infer<typeof UserEntitySchema>;