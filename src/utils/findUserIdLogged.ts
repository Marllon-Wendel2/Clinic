import { UnauthorizedException } from '@nestjs/common';

export function findUserLogged(body: Record<string, unknown>, req: { user?: { id: string } }): string {
  if (body?.usuarioId && typeof body.usuarioId === 'string') {
    return body.usuarioId;
  }

  if (req?.user?.id) {
    return req.user.id;
  }

  throw new UnauthorizedException('Usuário não identificado');
}