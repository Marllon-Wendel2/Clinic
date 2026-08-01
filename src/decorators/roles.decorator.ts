import { SetMetadata } from '@nestjs/common';

/**
 * Chave usada para armazenar e recuperar metadados de roles.
 * Usada tanto pelo decorator quanto pelo RolesGuard.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator que define quais roles sao necessarias para acessar um endpoint.
 *
 * @example
 *   @Roles('admin')
 *   @Post('register')
 *   async register() { ... }
 *
 * @example
 *   @Roles('admin', 'dentist')
 *   @Get('reports')
 *   async getReports() { ... }
 *
 * @param roles - Lista de roles permitidas (ex: 'admin', 'dentist')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);