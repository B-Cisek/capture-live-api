import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { UsersService } from '../../users/users.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  UserSignUpEvent,
  UserSignUpEventName,
} from '../events/user-signup.event';
import { UserLoginEvent, UserLoginEventName } from '../events/user-login.event';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const user = await this.usersService.getByEmail(signUpDto.email);

    if (user) {
      throw new UnprocessableEntityException('Email already exists');
    }

    const entity = new User();
    entity.email = signUpDto.email;
    entity.password = await this.hashService.hash(signUpDto.password);

    const newUser = await this.usersService.create(entity);

    this.eventEmitter.emit(
      UserSignUpEventName,
      new UserSignUpEvent(newUser.id),
    );

    return {
      access_token: this.createAccessToken(newUser),
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Account with this email not found');
    }

    const isPasswordValid = await this.hashService.equals(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.eventEmitter.emit(UserLoginEventName, new UserLoginEvent(user.id));

    return {
      access_token: this.createAccessToken(user),
    };
  }

  private createAccessToken(user: User): string {
    const payload = { sub: user.id, email: user.email };

    return this.jwtService.sign(payload);
  }
}
