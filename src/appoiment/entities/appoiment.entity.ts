import { z } from 'zod';

export const AppoimentPacienteSchema = z.object({
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
}).nullable().optional();

export const AppoimentEntitySchema = z.object({
  id: z.string().uuid(),
  pacienteId: z.string().uuid(),
  data: z.string(),
  hora: z.string(),
  duracao: z.number(),
  status: z.preprocess(
    (val) => val as string,
    z.enum(['agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou']),
  ),
  procedimento: z.string().nullable(),
  observacoes: z.string().nullable(),
  valor: z.number(),
  dentistaId: z.string().uuid().nullable(),
  paciente: AppoimentPacienteSchema,
  createdAt: z.date(),
});

export type AppoimentEntity = z.infer<typeof AppoimentEntitySchema>;
export type AppoimentPaciente = z.infer<typeof AppoimentPacienteSchema>;
