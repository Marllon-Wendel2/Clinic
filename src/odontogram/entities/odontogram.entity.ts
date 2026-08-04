import { z } from 'zod';

export const OdontogramEntitySchema = z.object({
  id: z.string().uuid(),
  pacienteId: z.string().uuid(),
  dentistaId: z.string().uuid().nullable(),
  dente: z.string(),
  face: z.string().nullable(),
  condicao: z.string(),
  observacao: z.string().nullable(),
  data: z.string(),
  createdAt: z.date(),
});

export type OdontogramEntity = z.infer<typeof OdontogramEntitySchema>;
