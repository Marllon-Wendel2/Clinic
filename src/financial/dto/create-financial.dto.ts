import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';

export const CreateFinancialSchema = z.object({
  tipo: z.enum(['receita', 'despesa'], { message: 'Tipo e obrigatorio (receita ou despesa)' }),
  descricao: z.string().min(1, 'Descricao e obrigatoria'),
  valor: z.number().min(0, 'Valor deve ser positivo'),
  data: z.string().optional(),
  categoria: z.string().optional(),
  pacienteId: z.string().uuid('ID do paciente invalido').optional(),
  consultaId: z.string().uuid('ID da consulta invalido').optional(),
  status: z.enum(['pago', 'pendente', 'cancelado', 'atrasado']).default('pago'),
  formaPagamento: z.string().optional(),
});

export type CreateFinancialDto = z.infer<typeof CreateFinancialSchema>;
export const CreateFinancialPipe = new ZodValidationPipe(CreateFinancialSchema);
