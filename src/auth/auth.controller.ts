<<<<<<< Updated upstream
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
}
=======

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  verifyResetCode(@Body() verifyResetCodeDto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(verifyResetCodeDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('resend-reset-code')
  @HttpCode(HttpStatus.OK)
  resendResetCode(@Body() body: { email: string }) {
    return this.authService.resendResetCode(body.email);
  }

  @Post('check-reset-code')
  @HttpCode(HttpStatus.OK)
  checkResetCode(@Body() body: { email: string; resetCode: string }) {
    return this.authService.checkResetCodeStatus(body.email, body.resetCode);
  }

  @Get('google')
  @UseGuards(OptionalGoogleAuthGuard)
  async googleAuth(@Req() req) {
    // This route initiates the Google login process
  }

  @Get('google/callback')
  @UseGuards(OptionalGoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    // This is the corrected function
    const { accessToken, user } = req.user || {};

    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';

    if (!accessToken) {
      throw new NotFoundException('Access token not found');
    }

    // We now stringify the user object and include it in the URL
    const userJson = encodeURIComponent(JSON.stringify(user));
    return res.redirect(`${frontendUrl}/auth/callback?token=${accessToken}&user=${userJson}`);
  }
}
>>>>>>> Stashed changes
