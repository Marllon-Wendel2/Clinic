import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma.service.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { LicenseModule } from './license/license.module.js';
import { PatientModule } from './patient/patient.module.js';
import { AppoimentModule } from './appoiment/appoiment.module.js';
import { ProcedureModule } from './procedure/procedure.module.js';
import { OdontogramModule } from './odontogram/odontogram.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    LicenseModule,
    PatientModule,
    AppoimentModule,
    ProcedureModule,
    OdontogramModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
