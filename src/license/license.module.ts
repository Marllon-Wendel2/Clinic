import { Module } from '@nestjs/common';
import { LicenseController } from './license.controller.js';
import { LicenseService } from './license.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
    controllers: [LicenseController],
    providers: [LicenseService, PrismaService],
    exports: [LicenseService],
})
export class LicenseModule {}
