import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';
import { CreateOdontogramSchema } from './create-odontogram.dto';

export const UpdateOdontogramSchema = CreateOdontogramSchema.partial();
export type UpdateOdontogramDto = z.infer<typeof UpdateOdontogramSchema>;
export const UpdateOdontogramPipe = new ZodValidationPipe(UpdateOdontogramSchema);
