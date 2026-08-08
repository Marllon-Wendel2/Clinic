import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import type { UpdatePatientDto, CreatePatientDto } from './dto/patient.dto'
import { PatientEntity, PatientEntitySchema } from './entities/patient.entity'
import { PatientService } from './patient.service';
import { CreatePatientPipe } from './dto/patient.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../decorators/roles.decorator.js';
import { findUserLogged } from 'src/utils/findUserIdLogged';


@Controller('patient')
export class PatientController {
  constructor(private readonly patienService: PatientService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Post()
  create(
    @Body(CreatePatientPipe) createPatientDto: CreatePatientDto,
    @Request() req: { user?: { id: string; role: string }}
  ) {
    const usuarioId = findUserLogged(createPatientDto, req);
    return this.patienService.createPatient(createPatientDto, usuarioId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get('dentist')
  findPatientsByUserId(
    @Request() req: { user: { id: string; role: string } }
  ) {
    if (req.user.role === 'admin') {
      return this.patienService.findAllPacients();
    }
    return this.patienService.findPatientsByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAllPacients() {
    return this.patienService.findAllPacients();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Get(':pacientId')
  findUnicPatientById(
    @Param('pacientId') pacientId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.patienService.findUnicPatientById(pacientId, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Patch(':pacientId')
  updatePatient(
    @Param('pacientId') pacientId: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.patienService.updatePatient(pacientId, updatePatientDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'dentist')
  @Delete(':pacientId')
  removePatient(
    @Param('pacientId') pacientId: string,
    @Request() req: { user: { id: string; role: string } }
  ) {
    return this.patienService.removePatient(pacientId, req.user);
  }
}
