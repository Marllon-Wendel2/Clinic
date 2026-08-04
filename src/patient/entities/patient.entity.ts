import { z } from 'zod';
export const PatientEntitySchema = z.object({
  id: z.string().uuid(),
  nome: z.string(),
  cpf: z.string().nullable(),
  telefone: z.string().nullable(),
  email: z.string().nullable(),
  dataNascimento: z.string().nullable(),
  endereco: z.string().nullable(),
  bairro: z.string().nullable(),
  cidade: z.string().nullable(),
  cep: z.string().nullable(),
  observacoes: z.string().nullable(),
  alergias: z.string().nullable(),
  medicamentos: z.string().nullable(),
  doencas: z.string().nullable(),
  usuarioId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PatientEntity = z.infer<typeof PatientEntitySchema>;