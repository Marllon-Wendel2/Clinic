import { z } from 'zod';

export const ProcedureEntitySchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  valor: z.number(),
  createdAt: z.date(),
});

export type ProcedureEntity = z.infer<typeof ProcedureEntitySchema>;
