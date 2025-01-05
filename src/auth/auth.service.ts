import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/signUpDto';
import { SignInDto } from './dto/signInDto';
import { User } from '../users/user.entity';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.getByEmail(signUpDto.email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const entity = new User();
    entity.email = signUpDto.email;
    entity.password = await this.hashService.hash(signUpDto.password);

    const newUser = await this.userService.create(entity);

    const payload = { sub: newUser._id.toString(), email: newUser.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.getByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.equals(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id.toString(), email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
