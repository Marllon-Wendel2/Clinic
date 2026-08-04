import { z } from 'zod';

export const ConsultasPorStatusSchema = z.object({
  agendado: z.number(),
  confirmado: z.number(),
  em_atendimento: z.number(),
  concluido: z.number(),
  cancelado: z.number(),
  faltou: z.number(),
});

export const FinanceiroSchema = z.object({
  totalReceitas: z.number(),
  totalDespesas: z.number(),
  saldo: z.number(),
  receitasRecebidas: z.number(),
  receitasPendentes: z.number(),
});

export const ProximaConsultaSchema = z.object({
  id: z.string(),
  paciente: z.string(),
  dentista: z.string(),
  data: z.string(),
  hora: z.string(),
  status: z.string(),
});

export const DashboardEntitySchema = z.object({
  totalPacientes: z.number(),
  totalConsultas: z.number(),
  consultasPorStatus: ConsultasPorStatusSchema,
  financeiro: FinanceiroSchema,
  proximasConsultas: z.array(ProximaConsultaSchema),
});

export type DashboardEntity = z.infer<typeof DashboardEntitySchema>;

export const DashboardSummaryEntitySchema = z.object({
  totalPacientes: z.number(),
  totalConsultas: z.number(),
  consultasHoje: z.number(),
  receitasMes: z.number(),
  despesasMes: z.number(),
});

export type DashboardSummaryEntity = z.infer<typeof DashboardSummaryEntitySchema>;
