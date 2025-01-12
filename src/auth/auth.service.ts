import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/user.entity';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserSignUpEvent } from './events';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ access_token: string }> {
    const user = await this.userService.getByEmail(signUpDto.email);

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const entity = new User();
    entity.email = signUpDto.email;
    entity.password = await this.hashService.hash(signUpDto.password);

    const newUser = await this.userService.create(entity);

    this.eventEmitter.emit(
      'user.signUp',
      new UserSignUpEvent(newUser._id.toString()),
    );

    return {
      access_token: await this.createToken(newUser),
    };
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
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

    this.eventEmitter.emit(
      'user.signIn',
      new UserSignUpEvent(user._id.toString()),
    );

    return {
      access_token: await this.createToken(user),
    };
  }

  private async createToken(user: User): Promise<string> {
    const payload = { sub: user._id.toString(), email: user.email };

    return await this.jwtService.signAsync(payload);
  }
}
