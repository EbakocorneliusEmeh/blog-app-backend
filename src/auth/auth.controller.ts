import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Req, Res, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { OptionalGoogleAuthGuard } from './guards/optional-google.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
 
  @Get('google')
  @UseGuards(OptionalGoogleAuthGuard)
  async googleAuth(@Req() req) {
  }

  @Get('google/callback')
  @UseGuards(OptionalGoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken, user } = req.user || {};

const frontendUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
    if (!accessToken) {
      throw new NotFoundException();
    }

    const query = user
      ? `?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`
      : `?token=${accessToken}`;

    return res.redirect(`${frontendUrl}/auth/callback${query}`);
  }
}