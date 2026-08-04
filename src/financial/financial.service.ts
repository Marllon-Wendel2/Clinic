import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateFinancialDto } from './dto/create-financial.dto';
import { UpdateFinancialDto } from './dto/update-financial.dto';
import { FinancialEntity, FinancialEntitySchema } from './entities/financial.entity';
import { parseEntity, parseEntities } from 'src/common/parse-entity';

@Injectable()
export class FinancialService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createFinancialDto: CreateFinancialDto): Promise<FinancialEntity> {
    try {
      if (createFinancialDto.pacienteId) {
        const patient = await this.prismaService.paciente.findUnique({
          where: { id: createFinancialDto.pacienteId },
        });

        if (!patient) {
          throw new NotFoundException('Paciente nao encontrado');
        }
      }

      if (createFinancialDto.consultaId) {
        const consultation = await this.prismaService.consulta.findUnique({
          where: { id: createFinancialDto.consultaId },
        });

        if (!consultation) {
          throw new NotFoundException('Consulta nao encontrada');
        }
      }

      const financial = await this.prismaService.lancamentoFinanceiro.create({
        data: {
          tipo: createFinancialDto.tipo,
          descricao: createFinancialDto.descricao,
          valor: createFinancialDto.valor,
          ...(createFinancialDto.data && { data: createFinancialDto.data }),
          ...(createFinancialDto.categoria && { categoria: createFinancialDto.categoria }),
          ...(createFinancialDto.pacienteId && { pacienteId: createFinancialDto.pacienteId }),
          ...(createFinancialDto.consultaId && { consultaId: createFinancialDto.consultaId }),
          status: createFinancialDto.status,
          ...(createFinancialDto.formaPagamento && { formaPagamento: createFinancialDto.formaPagamento }),
        },
      });

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<FinancialEntity[]> {
    try {
      const financials = await this.prismaService.lancamentoFinanceiro.findMany();
      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<FinancialEntity> {
    try {
      const financial = await this.prismaService.lancamentoFinanceiro.findUnique({
        where: { id },
      });

      if (!financial) {
        throw new NotFoundException('Lancamento financeiro nao encontrado');
      }

      return parseEntity(financial, FinancialEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByPaciente(pacienteId: string): Promise<FinancialEntity[]> {
    try {
      const financials = await this.prismaService.lancamentoFinanceiro.findMany({
        where: { pacienteId },
      });

      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByConsulta(consultaId: string): Promise<FinancialEntity[]> {
    try {
      const financials = await this.prismaService.lancamentoFinanceiro.findMany({
        where: { consultaId },
      });

      return parseEntities(financials, FinancialEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateFinancialDto: UpdateFinancialDto): Promise<FinancialEntity> {
    try {
      const existing = await this.prismaService.lancamentoFinanceiro.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Lancamento financeiro nao encontrado');
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
      if (error instanceof NotFoundException) throw error;
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
