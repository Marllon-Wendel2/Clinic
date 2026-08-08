import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AppoimentService } from './appoiment.service';
import type { CreateAppoimentDto } from './dto/create-appoiment.dto';
import { CreateAppoimentPipe } from './dto/create-appoiment.dto';
import type { UpdateAppoimentDto } from './dto/update-appoiment.dto';
import { UpdateAppoimentPipe } from './dto/update-appoiment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('appoiment')
export class AppoimentController {
  constructor(private readonly appoimentService: AppoimentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Post()
  create(
    @Body(CreateAppoimentPipe) createAppoimentDto: CreateAppoimentDto,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.appoimentService.create(createAppoimentDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get()
  findAll(@Request() req: { user: { id: string; role: string } }) {
    return this.appoimentService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('patient/:pacientId')
  findByPaciente(
    @Param('pacientId') pacientId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.appoimentService.findByPaciente(pacientId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('dentist/:dentistId')
  findByDentista(
    @Param('dentistId') dentistaId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.appoimentService.findByDentista(dentistaId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.appoimentService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateAppoimentPipe) updateAppoimentDto: UpdateAppoimentDto,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.appoimentService.update(id, updateAppoimentDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appoimentService.remove(id);
  }
}
