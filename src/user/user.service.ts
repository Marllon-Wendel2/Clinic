import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  OnModuleInit,
  InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { UserEntity } from './entities/user.entity.js';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    const username = this.configService.get<string>('SUPER_ADMIN_USERNAME');
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');
    const nome = this.configService.get<string>('NOME');

    if (!username || !password || !nome) {
      this.logger.warn(
        'Variaveis SUPER_ADMIN_USERNAME/SUPER_ADMIN_PASSWORD/NOME nao configuradas. Seed pulado.',
      );
      return;
    }

    const exists = await this.prisma.usuario.findUnique({
      where: { username },
    });

    if (exists) {
      this.logger.log(`Admin "${username}" ja existe. Seed pulado.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.usuario.create({
      data: {
        username,
        password: hashedPassword,
        role: 'admin',
        nome,
      },
    });

    this.logger.log(`Admin "${username}" criado com sucesso via seed.`);

  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if(createUserDto.role === 'admin') {
      throw new InternalServerErrorException("Não é possivel criar ADMIN")
    }
    
    const exists = await this.prisma.usuario.findUnique({
      where: { username: createUserDto.username },
    });

    if (exists) {
      throw new ConflictException('Username ja existe');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.usuario.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return this.toEntity(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.usuario.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((u) => this.toEntity(u));
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.prisma.usuario.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario #${id} nao encontrado`);
    }

    return this.toEntity(user);
  }

  async findByUsername(username: string) {
    return this.prisma.usuario.findUnique({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...updateUserDto };

    if (updateUserDto?.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.usuario.update({
      where: { id },
      data,
    });

    return this.toEntity(user);
  }

  async remove(id: string): Promise<UserEntity> {
    await this.findOne(id);

    const user = await this.prisma.usuario.delete({ where: { id } });

    return this.toEntity(user);
  }

  private toEntity(user: {
    id: string;
    username: string;
    role: string;
    nome: string;
    cro: string | null;
    createdAt: Date;
  }): UserEntity {
    return {
      id: user.id,
      username: user.username,
      role: user.role as 'admin' | 'dentist',
      nome: user.nome,
      cro: user.cro,
      createdAt: user.createdAt,
    };
  }
}
