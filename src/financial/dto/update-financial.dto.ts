import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';
import { CreateFinancialSchema } from './create-financial.dto';

export const UpdateFinancialSchema = CreateFinancialSchema.partial();
export type UpdateFinancialDto = z.infer<typeof UpdateFinancialSchema>;
export const UpdateFinancialPipe = new ZodValidationPipe(UpdateFinancialSchema);
