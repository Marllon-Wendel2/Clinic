import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';

export const CreateOdontogramSchema = z.object({
  pacienteId: z.string().uuid('ID do paciente invalido'),
  dentistaId: z.string().uuid('ID do dentista invalido').optional(),
  dente: z.string().min(1, 'Dente e obrigatorio'),
  face: z.string().optional(),
  condicao: z.string().min(1, 'Condicao e obrigatoria'),
  observacao: z.string().optional(),
  data: z.string().optional(),
});

export type CreateOdontogramDto = z.infer<typeof CreateOdontogramSchema>;
export const CreateOdontogramPipe = new ZodValidationPipe(CreateOdontogramSchema);
