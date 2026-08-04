import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';

export const CreateProcedureSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  valor: z.number().min(0).default(0),
});

export type CreateProcedureDto = z.infer<typeof CreateProcedureSchema>;
export const CreateProcedurePipe = new ZodValidationPipe(CreateProcedureSchema);
