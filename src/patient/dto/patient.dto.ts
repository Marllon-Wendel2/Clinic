import { ZodValidationPipe } from "src/common/zod-validation-pipe";
import { z } from "zod";

export const CreatePatientSchema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio'),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email('Email invalido').optional(),
  dataNascimento: z.string().optional(),
  endereco: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  cep: z.string().optional(),
  observacoes: z.string().optional(),
  alergias: z.string().optional(),
  medicamentos: z.string().optional(),
  doencas: z.string().optional(),
  usuarioId: z.string().uuid('ID do usuario invalido').optional(),
});

export type CreatePatientDto = z.infer<typeof CreatePatientSchema>;
export const CreatePatientPipe = new ZodValidationPipe(CreatePatientSchema);

export const UpdatePatientSchema = CreatePatientSchema.partial();
export type UpdatePatientDto = z.infer<typeof UpdatePatientSchema>;
export const UpdatePatientPipe = new ZodValidationPipe(UpdatePatientSchema);