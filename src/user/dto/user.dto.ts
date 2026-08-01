import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation-pipe';

const UserRoleEnum = z.enum(['admin', 'dentist']);

export const CreateUserSchema = z.object({
  username: z.string().min(2, 'O username deve ter no minimo 2 caracteres'),
  password: z.string().min(6, 'A senha deve ter no minimo 6 caracteres'),
  role: UserRoleEnum,
  nome: z.string().min(1, 'Nome e obrigatorio'),
  cro: z.string().optional()
})

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
export const CreateUserPipe = new ZodValidationPipe(CreateUserSchema);

export const UpdateUserSchema = CreateUserSchema.partial();
export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
export const UpdateUserPipe = new ZodValidationPipe(UpdateUserSchema);
