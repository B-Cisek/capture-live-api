import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthResponse, AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser, CurrentUserType } from '../../user/decorators/user.decorator';
import { Request } from 'express';
import { RefreshAuthGuard } from '../guards/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() signUpDto: SignUpDto): Promise<Partial<AuthResponse>> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async singIn(@Body() loginDto: LoginDto): Promise<Partial<AuthResponse>> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() request: Request): Promise<Partial<AuthResponse>> {
    const user = request.user as { id: string };
    return this.authService.refreshToken(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() request: Request): Promise<void> {
    const cookie = request.headers.cookie;

    if (!cookie) {
      return;
    }

    const match = cookie.match(/refresh_token=([^;]+)/);
    const refreshToken = match ? match[1] : null;

    if (!refreshToken) {
      return;
    }

    await this.authService.blacklistToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() userPayload: CurrentUserType) {
    return userPayload; // TODO: Return user resource or delete this endpoint
  }
}
