import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LicenseService } from './license.service.js';
import { UpgradeTierSchema, CreateLicenseSchema } from './dto/license.dto.js';
import type { UpgradeTierDto, CreateLicenseDto } from './dto/license.dto.js';
import { ZodValidationPipe } from '../common/zod-validation-pipe.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../decorators/roles.decorator.js';

const UpgradeTierPipe = new ZodValidationPipe(UpgradeTierSchema);
const CreateLicensePipe = new ZodValidationPipe(CreateLicenseSchema);

@Controller('license')
export class LicenseController {
    constructor(private readonly licenseService: LicenseService) {}

    @UseGuards(JwtAuthGuard)
    @Get('status')
    async getStatus(@Request() req: { user: { id: string } }) {
        return this.licenseService.getStatus(req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('create')
    async create(@Body(CreateLicensePipe) body: CreateLicenseDto) {
        return this.licenseService.create(body);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post('upgrade')
    async upgrade(@Body(UpgradeTierPipe) body: UpgradeTierDto) {
        return this.licenseService.upgrade(body.userId, body.tier);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('history/:userId')
    async getHistory(@Param('userId') userId: string) {
        return this.licenseService.getHistory(userId);
    }
}
