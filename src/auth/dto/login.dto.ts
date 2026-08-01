import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation-pipe';

export const LoginSchema = z.object({
  username: z.string().min(2, 'O username deve ter no minimo 2 caracteres'),
  password: z.string().min(6, 'A senha deve ter no minimo 6 caracteres'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export const LoginPipe = new ZodValidationPipe(LoginSchema);
