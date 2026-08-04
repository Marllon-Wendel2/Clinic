import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OdontogramService } from './odontogram.service';
import type { CreateOdontogramDto } from './dto/create-odontogram.dto';
import { CreateOdontogramPipe } from './dto/create-odontogram.dto';
import type { UpdateOdontogramDto } from './dto/update-odontogram.dto';
import { UpdateOdontogramPipe } from './dto/update-odontogram.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('odontogram')
export class OdontogramController {
  constructor(private readonly odontogramService: OdontogramService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Post()
  create(@Body(CreateOdontogramPipe) createOdontogramDto: CreateOdontogramDto) {
    return this.odontogramService.create(createOdontogramDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.odontogramService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('patient/:pacientId')
  findByPaciente(@Param('pacientId') pacientId: string) {
    return this.odontogramService.findByPaciente(pacientId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('dentist/:dentistId')
  findByDentista(@Param('dentistId') dentistaId: string) {
    return this.odontogramService.findByDentista(dentistaId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.odontogramService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Patch(':id')
  update(@Param('id') id: string, @Body(UpdateOdontogramPipe) updateOdontogramDto: UpdateOdontogramDto) {
    return this.odontogramService.update(id, updateOdontogramDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.odontogramService.remove(id);
  }
}
