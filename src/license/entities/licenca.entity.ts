import { z } from 'zod';

export const LicencaEntitySchema = z.object({
  id: z.string().uuid(),
  usuarioId: z.string().uuid(),
  tier: z.preprocess(
    (val) => val as string,
    z.enum(['basic', 'premium']),
  ),
  startDate: z.date(),
  endDate: z.date(),
});

export type LicencaEntity = z.infer<typeof LicencaEntitySchema>;
