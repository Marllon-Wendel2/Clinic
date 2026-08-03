import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { LicenseStatus, TIER_FEATURES, CreateLicenseDto } from "./dto/license.dto.js";

@Injectable()
export class LicenseService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateLicenseDto) {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: dto.usuarioId },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const licencaExistente = await this.prismaService.licenca.findFirst({
            where: { usuarioId: dto.usuarioId },
            orderBy: { startDate: 'desc' },
        });

        if (licencaExistente?.tier === dto.tier) {
            throw new ConflictException(`Usuário já possui licença tier ${dto.tier}`);
        }

        const licenca = await this.prismaService.licenca.create({
            data: {
                usuarioId: dto.usuarioId,
                tier: dto.tier,
                startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
                endDate: dto.endDate ? new Date(dto.endDate) : new Date(),
            },
        });

        return {
            message: `Licença tier ${dto.tier} criada com sucesso`,
            licenca: {
                id: licenca.id,
                tier: licenca.tier,
                startDate: licenca.startDate,
                endDate: licenca.endDate,
            },
        };
    }

    async getStatus(userId: string): Promise<LicenseStatus> {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
            }
        });

        if (!user) throw new NotFoundException('Usuário não foi encontrado');

        const licenca = await this.prismaService.licenca.findFirst({
            where: { usuarioId: userId },
            orderBy: { startDate: 'desc' },
        });

        const tier = licenca?.tier ?? 'basic';
        const features = TIER_FEATURES[tier];

        return {
            userId: user.id,
            username: user.username,
            tier,
            features: {
                dashboard: features.dashboard,
                odontograma: features.odontograma,
                relatorios: features.relatorios,
                multiUsuario: features.multiUsuario,
                backupCloud: features.backupCloud,
                suportePrioritario: features.suportePrioritario,
            },
        };
    }

    async upgrade(userId: string, newTier: 'basic' | 'premium') {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const licencaAtual = await this.prismaService.licenca.findFirst({
            where: { usuarioId: userId },
            orderBy: { startDate: 'desc' },
        });

        if (licencaAtual?.tier === newTier) {
            return {
                message: `Usuário já está no tier ${newTier}`,
                licenca: {
                    id: licencaAtual.id,
                    tier: licencaAtual.tier,
                    startDate: licencaAtual.startDate,
                    endDate: licencaAtual.endDate,
                },
            };
        }

        const novaLicenca = await this.prismaService.licenca.create({
            data: {
                usuarioId: userId,
                tier: newTier,
                startDate: new Date(),
                endDate: new Date(),
            },
        });

        return {
            message: `Tier atualizado de ${licencaAtual?.tier ?? 'basic'} para ${newTier}`,
            licenca: {
                id: novaLicenca.id,
                tier: novaLicenca.tier,
                startDate: novaLicenca.startDate,
                endDate: novaLicenca.endDate,
            },
        };
    }

    async getHistory(userId: string) {
        const user = await this.prismaService.usuario.findUnique({
            where: { id: userId },
            select: { id: true, username: true },
        });

        if (!user) throw new NotFoundException('Usuário não encontrado');

        const licencas = await this.prismaService.licenca.findMany({
            where: { usuarioId: userId },
            orderBy: { startDate: 'desc' },
        });

        return {
            userId: user.id,
            username: user.username,
            licencas: licencas.map((l) => ({
                id: l.id,
                tier: l.tier,
                startDate: l.startDate,
                endDate: l.endDate,
            })),
        };
    }
}
