import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RequestWithUser } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async singUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async singIn(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@Req() req: RequestWithUser) {
    return req.user; // TODO: Return user resource or delete this endpoint
  }
}
