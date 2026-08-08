import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateOdontogramDto } from './dto/create-odontogram.dto';
import { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { OdontogramEntity, OdontogramEntitySchema } from './entities/odontogram.entity';
import { parseEntity, parseEntities } from 'src/common/parse-entity';

@Injectable()
export class OdontogramService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOdontogramDto: CreateOdontogramDto, user?: { id: string; role: string }): Promise<OdontogramEntity> {
    try {
      const patient = await this.prismaService.paciente.findUnique({
        where: { id: createOdontogramDto.pacienteId },
      });

      if (!patient) {
        throw new NotFoundException('Paciente nao encontrado');
      }

      if (user?.role === 'dentist' && patient.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
      }

      if (createOdontogramDto.dentistaId) {
        const dentist = await this.prismaService.usuario.findUnique({
          where: { id: createOdontogramDto.dentistaId },
        });

        if (!dentist) {
          throw new NotFoundException('Dentista nao encontrado');
        }
      }

      const odontogram = await this.prismaService.odontograma.create({
        data: {
          pacienteId: createOdontogramDto.pacienteId,
          dentistaId: createOdontogramDto.dentistaId ?? null,
          dente: createOdontogramDto.dente,
          face: createOdontogramDto.face ?? null,
          condicao: createOdontogramDto.condicao,
          observacao: createOdontogramDto.observacao ?? null,
          ...(createOdontogramDto.data && { data: createOdontogramDto.data }),
        },
      });

      return parseEntity(odontogram, OdontogramEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(user?: { id: string; role: string }): Promise<OdontogramEntity[]> {
    try {
      const where = user?.role === 'dentist'
        ? { dentistaId: user.id }
        : {};

      const odontograms = await this.prismaService.odontograma.findMany({ where });
      return parseEntities(odontograms, OdontogramEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string, user?: { id: string; role: string }): Promise<OdontogramEntity> {
    try {
      const odontogram = await this.prismaService.odontograma.findUnique({
        where: { id },
        include: { paciente: { select: { usuarioId: true } } },
      });

      if (!odontogram) {
        throw new NotFoundException('Odontograma nao encontrado');
      }

      if (user?.role === 'dentist') {
        if (odontogram.dentistaId !== user.id && odontogram.paciente?.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: registro não pertence a este usuário');
        }
      }

      return parseEntity(odontogram, OdontogramEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByPaciente(pacienteId: string, user?: { id: string; role: string }): Promise<OdontogramEntity[]> {
    try {
      const patient = await this.prismaService.paciente.findUnique({ where: { id: pacienteId } });
      if (!patient) throw new NotFoundException('Paciente não encontrado');

      if (user?.role === 'dentist' && patient.usuarioId !== user.id) {
        throw new ForbiddenException('Acesso negado: paciente não pertence a este usuário');
      }

      const odontograms = await this.prismaService.odontograma.findMany({
        where: { pacienteId },
      });

      return parseEntities(odontograms, OdontogramEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByDentista(dentistaId: string, user?: { id: string; role: string }): Promise<OdontogramEntity[]> {
    try {
      if (user?.role === 'dentist' && dentistaId !== user.id) {
        throw new ForbiddenException('Acesso negado: não é possível ver registros de outro dentista');
      }

      const odontograms = await this.prismaService.odontograma.findMany({
        where: { dentistaId },
      });

      return parseEntities(odontograms, OdontogramEntitySchema);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateOdontogramDto: UpdateOdontogramDto, user?: { id: string; role: string }): Promise<OdontogramEntity> {
    try {
      const existing = await this.prismaService.odontograma.findUnique({
        where: { id },
        include: { paciente: { select: { usuarioId: true } } },
      });

      if (!existing) {
        throw new NotFoundException('Odontograma nao encontrado');
      }

      if (user?.role === 'dentist') {
        if (existing.dentistaId !== user.id && existing.paciente?.usuarioId !== user.id) {
          throw new ForbiddenException('Acesso negado: registro não pertence a este usuário');
        }
      }

      if (updateOdontogramDto.pacienteId) {
        const patient = await this.prismaService.paciente.findUnique({
          where: { id: updateOdontogramDto.pacienteId },
        });

        if (!patient) {
          throw new NotFoundException('Paciente nao encontrado');
        }
      }

      if (updateOdontogramDto.dentistaId) {
        const dentist = await this.prismaService.usuario.findUnique({
          where: { id: updateOdontogramDto.dentistaId },
        });

        if (!dentist) {
          throw new NotFoundException('Dentista nao encontrado');
        }
      }

      const odontogram = await this.prismaService.odontograma.update({
        where: { id },
        data: {
          ...(updateOdontogramDto.pacienteId !== undefined && { pacienteId: updateOdontogramDto.pacienteId }),
          ...(updateOdontogramDto.dentistaId !== undefined && { dentistaId: updateOdontogramDto.dentistaId ?? null }),
          ...(updateOdontogramDto.dente !== undefined && { dente: updateOdontogramDto.dente }),
          ...(updateOdontogramDto.face !== undefined && { face: updateOdontogramDto.face ?? null }),
          ...(updateOdontogramDto.condicao !== undefined && { condicao: updateOdontogramDto.condicao }),
          ...(updateOdontogramDto.observacao !== undefined && { observacao: updateOdontogramDto.observacao ?? null }),
          ...(updateOdontogramDto.data !== undefined && { data: updateOdontogramDto.data }),
        },
      });

      return parseEntity(odontogram, OdontogramEntitySchema);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string): Promise<OdontogramEntity> {
    try {
      const odontogram = await this.prismaService.odontograma.delete({
        where: { id },
      });

      return parseEntity(odontogram, OdontogramEntitySchema);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
