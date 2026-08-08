import { z } from 'zod';

export const FinancialEntitySchema = z.object({
  id: z.string().uuid(),
  tipo: z.preprocess(
    (val) => val as string,
    z.enum(['receita', 'despesa']),
  ),
  descricao: z.string(),
  valor: z.number(),
  data: z.string(),
  categoria: z.string().nullable(),
  pacienteId: z.string().uuid().nullable(),
  consultaId: z.string().uuid().nullable(),
  usuarioId: z.string().uuid().nullable(),
  status: z.preprocess(
    (val) => val as string,
    z.enum(['pago', 'pendente', 'cancelado', 'atrasado']),
  ),
  formaPagamento: z.string().nullable(),
  createdAt: z.date(),
});

export type FinancialEntity = z.infer<typeof FinancialEntitySchema>;
