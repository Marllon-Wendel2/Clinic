import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFinancialDto } from './dto/create-financial.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import { FinancialEntity, FinancialEntitySchema } from './entities/financial.entity';
import { parseEntity, parseEntities } from 'src/common/parse-entity';

@Injectable()
export class FinancialService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFinancialDto: CreateFinancialDto, user?: { id: string; role: string }): Promise<FinancialEntity> {
    try {
      if (createFinancialDto.pacienteId) {
        const patient = await this.prismaService.paciente.findUnique({
          where: { id: createFinancialDto.pacienteId },
        });

        if (!patient) {
          throw new NotFoundException('Paciente nao encontrado');
        }

        if (user?.role === 'dentist' && patient.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
        }
      }

      if (createFinancialDto.consultaId) {
        const consultation = await this.prismaService.consulta.findUnique({
          where: { id: createFinancialDto.consultaId },
        });

        if (!consultation) {
          throw new NotFoundException('Consulta nao encontrada');
        }

        if (user?.role === 'dentist' && consultation.dentistaId !== user.id) {
          throw new ForbiddenException('Acesso negado: consulta não pertence a este usuário');
        }
      }

      const usuarioId = user?.role === 'dentist' ? user.id : createFinancialDto.usuarioId ?? null;

      const financial = await this.prismaService.lancamentoFinanceiro.create({
        data: {
          tipo: createFinancialDto.tipo,
          descricao: createFinancialDto.descricao,
          valor: createFinancialDto.valor,
          ...(createFinancialDto.data && { data: createFinancialDto.data }),
          ...(createFinancialDto.categoria && { categoria: createFinancialDto.categoria }),
          ...(createFinancialDto.pacienteId && { pacienteId: createFinancialDto.pacienteId }),
          ...(createFinancialDto.consultaId && { consultaId: createFinancialDto.consultaId }),
          ...(usuarioId && { usuarioId }),
          status: createFinancialDto.status,
          ...(createFinancialDto.formaPagamento && { formaPagamento: createFinancialDto.formaPagamento }),
        },
      });

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(user?: { id: string; role: string }): Promise<FinancialEntity[]> {
    try {
      const where = user?.role === 'dentist'
        ? { usuarioId: user.id }
        : {};

      const financials = await this.prismaService.lancamentoFinanceiro.findMany({ where });
      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, user?: { id: string; role: string }): Promise<FinancialEntity> {
    try {
      const financial = await this.prismaService.lancamentoFinanceiro.findUnique({
        where: { id },
      });

      if (!financial) {
        throw new NotFoundException('Lancamento financeiro nao encontrado');
      }

      if (user?.role === 'dentist' && financial.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: lançamento não pertence a este usuário');
      }

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByPaciente(pacienteId: string, user?: { id: string; role: string }): Promise<FinancialEntity[]> {
    try {
      if (user?.role === 'dentist') {
        const patient = await this.prismaService.paciente.findUnique({ where: { id: pacienteId } });
        if (!patient) throw new NotFoundException('Paciente não encontrado');
        if (patient.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
        }
      }

      const financials = await this.prismaService.lancamentoFinanceiro.findMany({
        where: { pacienteId },
      });

      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByConsulta(consultaId: string, user?: { id: string; role: string }): Promise<FinancialEntity[]> {
    try {
      if (user?.role === 'dentist') {
        const consultation = await this.prismaService.consulta.findUnique({ where: { id: consultaId } });
        if (!consultation) throw new NotFoundException('Consulta não encontrada');
        if (consultation.dentistaId !== user.id) {
          throw new ForbiddenException('Acesso negado: consulta não pertence a este usuário');
        }
      }

      const financials = await this.prismaService.lancamentoFinanceiro.findMany({
        where: { consultaId },
      });

      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateFinancialDto: UpdateFinancialDto, user?: { id: string; role: string }): Promise<FinancialEntity> {
    try {
      const existing = await this.prismaService.lancamentoFinanceiro.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Lancamento financeiro nao encontrado');
      }

      if (user?.role === 'dentist' && existing.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: lançamento não pertence a este usuário');
      }

      if (updateFinancialDto.pacienteId) {
        const patient = await this.prismaService.paciente.findUnique({
          where: { id: updateFinancialDto.pacienteId },
        });

        if (!patient) {
          throw new NotFoundException('Paciente nao encontrado');
        }
      }

      if (updateFinancialDto.consultaId) {
        const consultation = await this.prismaService.consulta.findUnique({
          where: { id: updateFinancialDto.consultaId },
        });

        if (!consultation) {
          throw new NotFoundException('Consulta nao encontrada');
        }
      }

      const financial = await this.prismaService.lancamentoFinanceiro.update({
        where: { id },
        data: {
          ...(updateFinancialDto.tipo !== undefined && { tipo: updateFinancialDto.tipo }),
          ...(updateFinancialDto.descricao !== undefined && { descricao: updateFinancialDto.descricao }),
          ...(updateFinancialDto.valor !== undefined && { valor: updateFinancialDto.valor }),
          ...(updateFinancialDto.data !== undefined && { data: updateFinancialDto.data }),
          ...(updateFinancialDto.categoria !== undefined && { categoria: updateFinancialDto.categoria ?? null }),
          ...(updateFinancialDto.pacienteId !== undefined && { pacienteId: updateFinancialDto.pacienteId ?? null }),
          ...(updateFinancialDto.consultaId !== undefined && { consultaId: updateFinancialDto.consultaId ?? null }),
          ...(updateFinancialDto.status !== undefined && { status: updateFinancialDto.status }),
          ...(updateFinancialDto.formaPagamento !== undefined && { formaPagamento: updateFinancialDto.formaPagamento ?? null }),
        },
      });

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<FinancialEntity> {
    try {
      const financial = await this.prismaService.lancamentoFinanceiro.delete({
        where: { id },
      });

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
