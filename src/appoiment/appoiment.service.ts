import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAppoimentDto } from './dto/create-appoiment.dto';
import { UpdateAppoimentDto } from './dto/update-appoiment.dto';
import { AppoimentEntity, AppoimentEntitySchema } from './entities/appoiment.entity';
import { parseEntity, parseEntities } from 'src/common/parse-entity';

@Injectable()
export class AppoimentService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAppoimentDto: CreateAppoimentDto, user?: { id: string; role: string }): Promise<AppoimentEntity> {
    try {
      const patient = await this.prismaService.paciente.findUnique({
        where: { id: createAppoimentDto.pacienteId },
      });

      if (!patient) {
        throw new NotFoundException('Paciente nao encontrado');
      }

      if (user && user.role === 'dentist' && patient.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
      }

      if (createAppoimentDto.dentistaId) {
        const dentist = await this.prismaService.usuario.findUnique({
          where: { id: createAppoimentDto.dentistaId },
        });

        if (!dentist) {
          throw new NotFoundException('Dentista nao encontrado');
        }
      }

      const appoiment = await this.prismaService.consulta.create({
        data: {
          pacienteId: createAppoimentDto.pacienteId,
          dentistaId: createAppoimentDto.dentistaId ?? null,
          data: createAppoimentDto.data,
          hora: createAppoimentDto.hora,
          duracao: createAppoimentDto.duracao,
          status: createAppoimentDto.status,
          procedimento: createAppoimentDto.procedimento ?? null,
          observacoes: createAppoimentDto.observacoes ?? null,
          valor: createAppoimentDto.valor,
        },
      });

      return parseEntity(appoiment, AppoimentEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(user?: { id: string; role: string }): Promise<AppoimentEntity[]> {
    try {
      const where = user?.role === 'dentist'
        ? { dentistaId: user.id }
        : {};

      const appoiments = await this.prismaService.consulta.findMany({ where });
      return parseEntities(appoiments, AppoimentEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, user?: { id: string; role: string }): Promise<AppoimentEntity> {
    try {
      const appoiment = await this.prismaService.consulta.findUnique({
        where: { id },
        include: { paciente: { select: { usuarioId: true } } },
      });

      if (!appoiment) {
        throw new NotFoundException('Consulta nao encontrada');
      }

      if (user?.role === 'dentist') {
        if (appoiment.dentistaId !== user.id && appoiment.paciente?.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: consulta não pertence a este usuário');
        }
      }

      return parseEntity(appoiment, AppoimentEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByPaciente(pacienteId: string, user?: { id: string; role: string }): Promise<AppoimentEntity[]> {
    try {
      const patient = await this.prismaService.paciente.findUnique({ where: { id: pacienteId } });
      if (!patient) throw new NotFoundException('Paciente não encontrado');

      if (user?.role === 'dentist' && patient.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
      }

      const appoiments = await this.prismaService.consulta.findMany({
        where: { pacienteId },
      });

      return parseEntities(appoiments, AppoimentEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByDentista(dentistaId: string, user?: { id: string; role: string }): Promise<AppoimentEntity[]> {
    try {
      if (user?.role === 'dentist' && dentistaId !== user.id) {
        throw new ForbiddenException('Acesso negado: não é possível ver consultas de outro dentista');
      }

      const appoiments = await this.prismaService.consulta.findMany({
        where: { dentistaId },
      });

      return parseEntities(appoiments, AppoimentEntitySchema);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateAppoimentDto: UpdateAppoimentDto, user?: { id: string; role: string }): Promise<AppoimentEntity> {
    try {
      const existing = await this.prismaService.consulta.findUnique({
        where: { id },
        include: { paciente: { select: { usuarioId: true } } },
      });

      if (!existing) {
        throw new NotFoundException('Consulta nao encontrada');
      }

      if (user?.role === 'dentist') {
        if (existing.dentistaId !== user.id && existing.paciente?.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: consulta não pertence a este usuário');
        }
      }

      if (updateAppoimentDto.pacienteId) {
        const patient = await this.prismaService.paciente.findUnique({
          where: { id: updateAppoimentDto.pacienteId },
        });

        if (!patient) {
          throw new NotFoundException('Paciente nao encontrado');
        }
      }

      if (updateAppoimentDto.dentistaId) {
        const dentist = await this.prismaService.usuario.findUnique({
          where: { id: updateAppoimentDto.dentistaId },
        });

        if (!dentist) {
          throw new NotFoundException('Dentista nao encontrado');
        }
      }

      const appoiment = await this.prismaService.consulta.update({
        where: { id },
        data: {
          ...(updateAppoimentDto.pacienteId !== undefined && { pacienteId: updateAppoimentDto.pacienteId }),
          ...(updateAppoimentDto.dentistaId !== undefined && { dentistaId: updateAppoimentDto.dentistaId ?? null }),
          ...(updateAppoimentDto.data !== undefined && { data: updateAppoimentDto.data }),
          ...(updateAppoimentDto.hora !== undefined && { hora: updateAppoimentDto.hora }),
          ...(updateAppoimentDto.duracao !== undefined && { duracao: updateAppoimentDto.duracao }),
          ...(updateAppoimentDto.status !== undefined && { status: updateAppoimentDto.status }),
          ...(updateAppoimentDto.procedimento !== undefined && { procedimento: updateAppoimentDto.procedimento ?? null }),
          ...(updateAppoimentDto.observacoes !== undefined && { observacoes: updateAppoimentDto.observacoes ?? null }),
          ...(updateAppoimentDto.valor !== undefined && { valor: updateAppoimentDto.valor }),
        },
      });

      return parseEntity(appoiment, AppoimentEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<AppoimentEntity> {
    try {
      const appoiment = await this.prismaService.consulta.delete({
        where: { id },
      });

      return parseEntity(appoiment, AppoimentEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
