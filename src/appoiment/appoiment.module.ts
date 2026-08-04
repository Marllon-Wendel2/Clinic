import { Module } from '@nestjs/common';
import { AppoimentService } from './appoiment.service';
import { AppoimentController } from './appoiment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AppoimentController],
  providers: [AppoimentService, PrismaService],
  exports: [AppoimentService],
})
export class AppoimentModule {}
