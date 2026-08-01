import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator.js';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Le as roles requeridas do decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Se nao ha metadado @Roles(), permite acesso
    //    (nao toda requisicao precisa de role check)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. Extrai o usuario da requisicao
    //    (populado pelo JwtAuthGuard anterior)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario nao autenticado');
    }

    // 4. Verifica se o role do usuario esta na lista de roles permitidas
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Roles requeridas: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}