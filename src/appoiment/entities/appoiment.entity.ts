import { z } from 'zod';

export const AppoimentEntitySchema = z.object({
  id: z.string().uuid(),
  pacienteId: z.string().uuid(),
  data: z.string(),
  hora: z.string(),
  duracao: z.number(),
  status: z.preprocess(
    (val) => val as string,
    z.enum(['agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou']),
  ),
  procedimento: z.string().nullable(),
  observacoes: z.string().nullable(),
  valor: z.number(),
  dentistaId: z.string().uuid().nullable(),
  createdAt: z.date(),
});

export type AppoimentEntity = z.infer<typeof AppoimentEntitySchema>;
