import { ZodValidationPipe } from 'src/common/zod-validation-pipe';
import { z } from 'zod';

export const CreateAppoimentSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente invalido'),
  dentistaId: z.string().uuid('ID do dentista invalido').optional(),
  data: z.string().min(1, 'Data e obrigatoria'),
  hora: z.string().min(1, 'Hora e obrigatoria'),
  duracao: z.number().int().positive().default(30),
  status: z.enum(['agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou']).default('agendado'),
  procedimento: z.string().optional(),
  observacoes: z.string().optional(),
  valor: z.number().min(0).default(0),
});

export type CreateAppoimentDto = z.infer<typeof CreateAppoimentSchema>;
export const CreateAppoimentPipe = new ZodValidationPipe(CreateAppoimentSchema);
