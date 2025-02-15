import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { HashService } from '../services/hash.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly hashService: HashService,
    @InjectRepository(BlacklistedToken)
    private readonly blacklistedTokenRepository: Repository<BlacklistedToken>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { sub: string; iat: number; exp: number }, // TODO: crate type for payload
  ): Promise<{ id: string }> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const hashedToken = this.hashService.determineHash(token);

    const blacklistedToken = await this.blacklistedTokenRepository.findOneBy({
      token: hashedToken,
    });

    if (blacklistedToken) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    return { id: payload.sub };
  }
}
