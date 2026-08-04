import { Module } from '@nestjs/common';
import { OdontogramService } from './odontogram.service';
import { OdontogramController } from './odontogram.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [OdontogramController],
  providers: [OdontogramService, PrismaService],
  exports: [OdontogramService],
})
export class OdontogramModule {}
