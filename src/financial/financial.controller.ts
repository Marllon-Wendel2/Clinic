import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
  create(
    @Body(CreateFinancialPipe) createFinancialDto: CreateFinancialDto,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.financialService.create(createFinancialDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get()
  findAll(@Request() req: { user: { id: string; role: string } }) {
    return this.financialService.findAll(req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('patient/:pacientId')
  findByPaciente(
    @Param('pacientId') pacientId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.financialService.findByPaciente(pacientId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('consult/:consultId')
  findByConsulta(
    @Param('consultId') consultId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.financialService.findByConsulta(consultId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.financialService.findOne(id, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(UpdateFinancialPipe) updateFinancialDto: UpdateFinancialDto,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.financialService.update(id, updateFinancialDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }
}
