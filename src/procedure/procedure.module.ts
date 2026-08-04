import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from './procedure.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ProcedureController],
  providers: [ProcedureService, PrismaService],
  exports: [ProcedureService],
})
export class ProcedureModule {}
