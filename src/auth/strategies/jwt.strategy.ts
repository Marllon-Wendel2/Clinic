import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service.js';
import { PrismaService } from '../../prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'default-secret'),
    });
  }

  async validate(payload: { sub: string; username: string }) {
    try {
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        throw new UnauthorizedException();
      }

      const licenca = await this.prisma.licenca.findFirst({
        where: { usuarioId: user.id },
        orderBy: { startDate: 'desc' },
      });

      const tier = licenca?.tier ?? 'basic';

      return { id: user.id, username: user.username, role: user.role, tier };
    } catch (error) {
      this.logger.error(`Erro na validação do JWT: ${error.message}`, error.stack);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
