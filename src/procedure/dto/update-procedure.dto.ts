import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';
import { CreateProcedureSchema } from './create-procedure.dto';

export const UpdateProcedureSchema = CreateProcedureSchema.partial();
export type UpdateProcedureDto = z.infer<typeof UpdateProcedureSchema>;
export const UpdateProcedurePipe = new ZodValidationPipe(UpdateProcedureSchema);
