import { z } from 'zod';
import { ZodValidationPipe } from 'src/common/zod-validation-pipe';
import { CreateAppoimentSchema } from './create-appoiment.dto';

export const UpdateAppoimentSchema = CreateAppoimentSchema.partial();
export type UpdateAppoimentDto = z.infer<typeof UpdateAppoimentSchema>;
export const UpdateAppoimentPipe = new ZodValidationPipe(UpdateAppoimentSchema);
