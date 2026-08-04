
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { parseEntity } from 'src/common/parse-entity';
import { DashboardEntity, DashboardEntitySchema, DashboardSummaryEntity, DashboardSummaryEntitySchema } from './entities/dashboard.entity';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboard(query: DashboardQueryDto): Promise<DashboardEntity> {
    try {
      const dateFilter = this.buildDateFilter(query);

      const [totalPacientes, consultasPorStatus, financeiro, proximasConsultas, totalConsultas] =
        await Promise.all([
          this.prismaService.paciente.count(),
          this.getConsultasPorStatus(dateFilter),
          this.getFinanceiro(dateFilter),
          this.getProximasConsultas(),
          this.prismaService.consulta.count({ where: dateFilter }),
        ]);

      const dashboard: DashboardEntity = {
        totalPacientes,
        totalConsultas,
        consultasPorStatus,
        financeiro,
        proximasConsultas,
      };

      return parseEntity(dashboard, DashboardEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getSummary(): Promise<DashboardSummaryEntity> {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalPacientes, totalConsultas, consultasHoje, receitasMes, despesasMes] =
        await Promise.all([
          this.prismaService.paciente.count(),
          this.prismaService.consulta.count(),
          this.prismaService.consulta.count({
            where: {
              data: now.toISOString().split('T')[0],
            },
          }),
          this.prismaService.lancamentoFinanceiro.aggregate({
            where: {
              tipo: 'receita',
              data: { gte: startOfMonth.toISOString().split('T')[0] },
            },
            _sum: { valor: true },
          }),
          this.prismaService.lancamentoFinanceiro.aggregate({
            where: {
              tipo: 'despesa',
              data: { gte: startOfMonth.toISOString().split('T')[0] },
            },
            _sum: { valor: true },
          }),
        ]);

      const summary: DashboardSummaryEntity = {
        totalPacientes,
        totalConsultas,
        consultasHoje,
        receitasMes: Number(receitasMes._sum.valor ?? 0),
        despesasMes: Number(despesasMes._sum.valor ?? 0),
      };

      return parseEntity(summary, DashboardSummaryEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private buildDateFilter(query: DashboardQueryDto) {
    const now = new Date();

    if (query.startDate && query.endDate) {
      return {
        createdAt: {
          gte: new Date(query.startDate),
          lte: new Date(query.endDate),
        },
      };
    }

    if (query.period) {
      let startDate: Date;

      switch (query.period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
      }

      return {
        createdAt: { gte: startDate },
      };
    }

    return {};
  }

  private async getConsultasPorStatus(dateFilter: Record<string, unknown>) {
    const statusCounts = await this.prismaService.consulta.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { id: true },
    });

    const counts = {
      agendado: 0,
      confirmado: 0,
      em_atendimento: 0,
      concluido: 0,
      cancelado: 0,
      faltou: 0,
    };

    for (const item of statusCounts) {
      counts[item.status as keyof typeof counts] = item._count.id;
    }

    return counts;
  }

  private async getFinanceiro(dateFilter: Record<string, unknown>) {
    const [receitas, despesas, receitasRecebidas, receitasPendentes] = await Promise.all([
      this.prismaService.lancamentoFinanceiro.aggregate({
        where: { tipo: 'receita', ...dateFilter },
        _sum: { valor: true },
      }),
      this.prismaService.lancamentoFinanceiro.aggregate({
        where: { tipo: 'despesa', ...dateFilter },
        _sum: { valor: true },
      }),
      this.prismaService.lancamentoFinanceiro.aggregate({
        where: { tipo: 'receita', status: 'pago', ...dateFilter },
        _sum: { valor: true },
      }),
      this.prismaService.lancamentoFinanceiro.aggregate({
        where: { tipo: 'receita', status: 'pendente', ...dateFilter },
        _sum: { valor: true },
      }),
    ]);

    const totalReceitas = Number(receitas._sum.valor ?? 0);
    const totalDespesas = Number(despesas._sum.valor ?? 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      receitasRecebidas: Number(receitasRecebidas._sum.valor ?? 0),
      receitasPendentes: Number(receitasPendentes._sum.valor ?? 0),
    };
  }

  private async getProximasConsultas() {
    const consultas = await this.prismaService.consulta.findMany({
      where: {
        status: { in: ['agendado', 'confirmado'] },
      },
      orderBy: [{ data: 'asc' }, { hora: 'asc' }],
      take: 5,
      include: {
        paciente: { select: { nome: true } },
        dentista: { select: { nome: true } },
      },
    });

    return consultas.map((c) => ({
      id: c.id,
      paciente: c.paciente?.nome ?? 'N/A',
      dentista: c.dentista?.nome ?? 'N/A',
      data: c.data,
      hora: c.hora,
      status: c.status,
    }));
  }
}
