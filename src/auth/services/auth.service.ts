import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserSignUpEvent, UserSignUpEventName } from '../events/user-signup.event';
import { UserLoginEvent, UserLoginEventName } from '../events/user-login.event';
import { UsersService } from '../../user/services/users.service';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenEvent, RefreshTokenEventName } from '../events/refresh-token.event';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Partial<AuthResponse>> {
    const user = await this.usersService.getByEmail(signUpDto.email);

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const entity = new User();
    entity.email = signUpDto.email;
    entity.password = await this.hashService.hash(signUpDto.password);

    const newUser = await this.usersService.create(entity);

    this.eventEmitter.emit(UserSignUpEventName, new UserSignUpEvent(newUser.id));

    return this.createAuthResponse(newUser, true);
  }

  async login(loginDto: LoginDto): Promise<Partial<AuthResponse>> {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Account with this email not found');
    }

    const isPasswordValid = await this.hashService.equals(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.eventEmitter.emit(UserLoginEventName, new UserLoginEvent(user.id));

    return this.createAuthResponse(user, true);
  }

  async blacklistToken(token: string): Promise<void> {
    const data = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      algorithms: [this.configService.get('JWT_REFRESH_ALGORITHM')],
    });

    const blacklistedToken = new BlacklistedToken();
    blacklistedToken.token = this.hashService.determineHash(token);
    blacklistedToken.expiresAt = new Date(data.exp * 1000);
    await this.blacklistedTokenRepository.save(blacklistedToken);
  }

  async refreshToken(userId: string): Promise<Partial<AuthResponse>> {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    this.eventEmitter.emit(RefreshTokenEventName, new RefreshTokenEvent(user.id));

    return this.createAuthResponse(user);
  }

  private createAuthResponse(user: User, withRefreshToken = false): Partial<AuthResponse> {
    const response: Partial<AuthResponse> = {
      access_token: this.createAccessToken(user),
    };

    // TODO: maybe will change
    if (withRefreshToken) {
      response.refresh_token = this.createRefreshToken(user);
    }

    return response;
  }

  private createAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }

  private createRefreshToken(user: User): string {
    const payload = { sub: user.id };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
      algorithm: this.configService.get('JWT_REFRESH_ALGORITHM'),
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  private async clearExpiredTokens(): Promise<void> {
    const date = new Date();

    await this.blacklistedTokenRepository.delete({
      expiresAt: LessThan(date),
    });
  }
}
