import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { ProcedureEntity, ProcedureEntitySchema } from './entities/procedure.entity';
import { parseEntity, parseEntities } from 'src/common/parse-entity';

@Injectable()
export class ProcedureService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProcedureDto: CreateProcedureDto): Promise<ProcedureEntity> {
    try {
      const procedure = await this.prismaService.catalogoProcedimento.create({
        data: {
          nome: createProcedureDto.nome,
          valor: createProcedureDto.valor,
        },
      });

      return parseEntity(procedure, ProcedureEntitySchema);
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Ja existe um procedimento com esse nome');
      }
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<ProcedureEntity[]> {
    try {
      const procedures = await this.prismaService.catalogoProcedimento.findMany();
      return parseEntities(procedures, ProcedureEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<ProcedureEntity> {
    try {
      const procedure = await this.prismaService.catalogoProcedimento.findUnique({
        where: { id },
      });

      if (!procedure) {
        throw new NotFoundException('Procedimento nao encontrado');
      }

      return parseEntity(procedure, ProcedureEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateProcedureDto: UpdateProcedureDto): Promise<ProcedureEntity> {
    try {
      const existing = await this.prismaService.catalogoProcedimento.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundException('Procedimento nao encontrado');
      }

      const procedure = await this.prismaService.catalogoProcedimento.update({
        where: { id },
        data: {
          ...(updateProcedureDto.nome !== undefined && { nome: updateProcedureDto.nome }),
          ...(updateProcedureDto.valor !== undefined && { valor: updateProcedureDto.valor }),
        },
      });

      return parseEntity(procedure, ProcedureEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error?.code === 'P2002') {
        throw new ConflictException('Ja existe um procedimento com esse nome');
      }
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<ProcedureEntity> {
    try {
      const procedure = await this.prismaService.catalogoProcedimento.delete({
        where: { id },
      });

      return parseEntity(procedure, ProcedureEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
