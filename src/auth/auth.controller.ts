import { Controller, Post, Body, Get, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginPipe } from './dto/login.dto.js';
import { CreateUserPipe } from '../user/dto/user.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { CreateUserDto } from '../user/dto/user.dto.js';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(LoginPipe) loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new ForbiddenException('Credenciais invalidas');
    }

    return this.authService.login(user);
  }

  @UseGuards()
  @Post('register')
  async register(
    @Body(CreateUserPipe) createUserDto: CreateUserDto,
    @Request() req: { user?: { role: string } },
  ) {
    if (createUserDto.role === 'admin') {
      if (!req?.user || req.user.role !== 'admin') {
        throw new ForbiddenException('Apenas admins podem criar usuarios admin');
      }
    }

    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req: { user: { id: string; username: string; role: string } },
  ) {
    return req.user;
  }
}
