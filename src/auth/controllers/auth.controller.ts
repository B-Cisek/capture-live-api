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
import {
  CurrentUser,
  CurrentUserType,
} from '../../users/decorators/user.decorator';
import { Request } from 'express';

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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request) {
    console.log(request.headers);
    // TODO: Blacklist token
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() userPayload: CurrentUserType) {
    return userPayload; // TODO: Return user resource or delete this endpoint
  }
}
