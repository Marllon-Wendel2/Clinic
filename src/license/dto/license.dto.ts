import { z } from 'zod';

export const TIER_FEATURES = {
  basic: {
    dashboard: false,
    odontograma: false,
    relatorios: false,
    multiUsuario: false,
    backupCloud: false,
    suportePrioritario: false,
  },
  premium: {
    dashboard: true,
    odontograma: true,
    relatorios: true,
    multiUsuario: true,
    backupCloud: true,
    suportePrioritario: true,
  },
} as const;

export const LicenseStatusSchema = z.object({
  userId: z.string().uuid(),
  username: z.string(),
  tier: z.enum(['basic', 'premium']),
  features: z.object({
    dashboard: z.boolean(),
    odontograma: z.boolean(),
    relatorios: z.boolean(),
    multiUsuario: z.boolean(),
    backupCloud: z.boolean(),
    suportePrioritario: z.boolean(),
  }),
});

export type LicenseStatus = z.infer<typeof LicenseStatusSchema>;

export const UpgradeTierSchema = z.object({
  userId: z.string().uuid('ID do usuário inválido'),
  tier: z.enum(['basic', 'premium']),
});

export type UpgradeTierDto = z.infer<typeof UpgradeTierSchema>;

export const CreateLicenseSchema = z.object({
  usuarioId: z.string().uuid('ID do usuário inválido'),
  tier: z.enum(['basic', 'premium']),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateLicenseDto = z.infer<typeof CreateLicenseSchema>;