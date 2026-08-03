import { ZodSchema } from 'zod';

/**
 * Parse genérico de objetos Prisma para entities.
 *
 * @param data - Objeto retornado pelo Prisma
 * @param schema - Schema Zod da entity
 * @returns Entity tipada
 *
 * @example
 *   const user = parseEntity(prismaUser, UserEntitySchema);
 *   const licenca = parseEntity(prismaLicenca, LicencaEntitySchema);
 */
export function parseEntity<T>(data: unknown, schema: ZodSchema<T>): T {
  return schema.parse(data);
}

/**
 * Parse genérico para arrays.
 *
 * @param data - Array de objetos Prisma
 * @param schema - Schema Zod da entity
 * @returns Array de entities tipadas
 */
export function parseEntities<T>(data: unknown[], schema: ZodSchema<T>): T[] {
  return data.map((item) => schema.parse(item));
}
