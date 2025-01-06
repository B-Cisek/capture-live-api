import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashService } from './hash.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signUpDto';
import { User } from '../users/user.entity';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SignInDto } from './dto/signInDto';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockHashService: Partial<HashService>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockUsersService = {
      getByEmail: jest.fn(),
      create: jest.fn(),
    };

    mockHashService = {
      hash: jest.fn(),
      equals: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: HashService, useValue: mockHashService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw an error if email already exists', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
      };
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue({} as User);

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signUpDto.email);
    });

    it('should create a new user and return an access token', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      const newUser = { _id: '1', email: signUpDto.email };

      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(null);
      (mockHashService.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (mockUsersService.create as jest.Mock).mockResolvedValue(newUser);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.signUp(signUpDto);

      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(mockHashService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        email: signUpDto.email,
        password: hashedPassword,
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: newUser._id.toString(),
        email: newUser.email,
      });
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('signIn', () => {
    it('should throw an error if user does not exist', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signInDto.email);
    });

    it('should throw an error if password is invalid', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = { password: 'hashedPassword' } as User;

      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(user);
      (mockHashService.equals as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockHashService.equals).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
    });

    it('should return an access token if credentials are valid', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        _id: '1',
        email: signInDto.email,
        password: 'hashedPassword',
      };

      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(user);
      (mockHashService.equals as jest.Mock).mockResolvedValue(true);
      (mockJwtService.signAsync as jest.Mock).mockResolvedValue('token');

      const result = await service.signIn(signInDto);

      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(mockHashService.equals).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: user._id.toString(),
        email: user.email,
      });
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
