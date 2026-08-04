import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePatientDto, UpdatePatientDto} from './dto/patient.dto';
import { PatientEntity, PatientEntitySchema } from './entities/patient.entity'

@Injectable()
export class PatientService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPatient(createPatientDto: CreatePatientDto, usuarioId: string): Promise<PatientEntity> {

    try {
      let id;

    
      if(!createPatientDto.usuarioId && !usuarioId) {
        throw new BadRequestException('Informe o usuário')
      };
  
      if(createPatientDto.usuarioId){
        id = createPatientDto.usuarioId;
      } else {
        id = usuarioId;
      }
      const user = await this.prismaService.usuario.findUnique({
        where: { id },
      });
      
      if(!user){
        throw new NotFoundException('Usuario não encontrado');
      }
  
      if(!createPatientDto.cpf) throw new BadRequestException('CPF e obrigatorio');
  
      const cpfExists = await this.prismaService.paciente.findUnique({
        where: { cpf: createPatientDto.cpf },
      });
  
      if(cpfExists) throw new ConflictException('CPF já cadastrado');
  
      const patient = await this.prismaService.paciente.create({
        data: createPatientDto,
      });
  
      return PatientEntitySchema.parse(patient);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findPatientsByUserId(userId: string) {
    try {
      const patients = await this.prismaService.paciente.findMany({
        where: { usuarioId: userId },
      });
  
    return patients;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllPacients() {
    try {
      const patients = await this.prismaService.paciente.findMany();
  
      return patients; 
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findUnicPatientById(id: string) {
    try {
      const patient = await this.prismaService.paciente.findUnique({
        where: { id },
      });
  
      if(!patient) throw new NotFoundException('Paciente não encontrado');
  
      return patient;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientEntity> {
    try {
            const paciente = await this.prismaService.paciente.update({
        where: { id },
        data: {
          ...(updatePatientDto.nome !== undefined && { nome: updatePatientDto.nome }),
          ...(updatePatientDto.cpf !== undefined && { cpf: updatePatientDto.cpf ?? null }),
          ...(updatePatientDto.telefone !== undefined && { telefone: updatePatientDto.telefone ?? null }),
          ...(updatePatientDto.email !== undefined && { email: updatePatientDto.email ?? null }),
          ...(updatePatientDto.dataNascimento !== undefined && { dataNascimento: updatePatientDto.dataNascimento ?? null }),
          ...(updatePatientDto.endereco !== undefined && { endereco: updatePatientDto.endereco ?? null }),
          ...(updatePatientDto.bairro !== undefined && { bairro: updatePatientDto.bairro ?? null }),
          ...(updatePatientDto.cidade !== undefined && { cidade: updatePatientDto.cidade ?? null }),
          ...(updatePatientDto.cep !== undefined && { cep: updatePatientDto.cep ?? null }),
          ...(updatePatientDto.observacoes !== undefined && { observacoes: updatePatientDto.observacoes ?? null }),
          ...(updatePatientDto.alergias !== undefined && { alergias: updatePatientDto.alergias ?? null }),
          ...(updatePatientDto.medicamentos !== undefined && { medicamentos: updatePatientDto.medicamentos ?? null }),
          ...(updatePatientDto.doencas !== undefined && { doencas: updatePatientDto.doencas ?? null }),
          ...(updatePatientDto.usuarioId !== undefined && { usuarioId: updatePatientDto.usuarioId ?? null }),
        },
      });

      return PatientEntitySchema.parse(paciente);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async removePatient(id: string): Promise<PatientEntity> {
    try {
      const patient = await this.prismaService.paciente.delete({
        where: { id },
      });

      return PatientEntitySchema.parse(patient);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
