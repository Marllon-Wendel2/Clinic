import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import type { CreateProcedureDto } from './dto/create-procedure.dto';
import { CreateProcedurePipe } from './dto/create-procedure.dto';
import type { UpdateProcedureDto } from './dto/update-procedure.dto';
import { UpdateProcedurePipe } from './dto/update-procedure.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('procedure')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body(CreateProcedurePipe) createProcedureDto: CreateProcedureDto) {
    return this.procedureService.create(createProcedureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get()
  findAll() {
    return this.procedureService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.procedureService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body(UpdateProcedurePipe) updateProcedureDto: UpdateProcedureDto) {
    return this.procedureService.update(id, updateProcedureDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.procedureService.remove(id);
  }
}
