import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FinancialService } from './financial.service';
import type { CreateFinancialDto } from './dto/create-financial.dto';
import { CreateFinancialPipe } from './dto/create-financial.dto';
import type { UpdateFinancialDto } from './dto/update-financial.dto';
import { UpdateFinancialPipe } from './dto/update-financial.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator.js';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Post()
  create(@Body(CreateFinancialPipe) createFinancialDto: CreateFinancialDto) {
    return this.financialService.create(createFinancialDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.financialService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('patient/:pacientId')
  findByPaciente(@Param('pacientId') pacientId: string) {
    return this.financialService.findByPaciente(pacientId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('consult/:consultId')
  findByConsulta(@Param('consultId') consultId: string) {
    return this.financialService.findByConsulta(consultId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financialService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Patch(':id')
  update(@Param('id') id: string, @Body(UpdateFinancialPipe) updateFinancialDto: UpdateFinancialDto) {
    return this.financialService.update(id, updateFinancialDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }
}
