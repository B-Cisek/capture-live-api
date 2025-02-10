import { Test, TestingModule } from '@nestjs/testing';
import {
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../users/entities/user.entity';
import { UserSignUpEventName } from '../events/user-signup.event';
import { UserLoginEventName } from '../events/user-login.event';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtService: Partial<JwtService>;
  let mockHashService: Partial<HashService>;
  let mockEventEmitter: Partial<EventEmitter2>;

  beforeEach(async () => {
    // Create mock implementations for all dependencies
    mockUsersService = {
      getByEmail: jest.fn(),
      create: jest.fn(),
    };

    // Note: Our AuthService calls jwtService.sign, not signAsync.
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-token'),
    };

    mockHashService = {
      hash: jest.fn().mockResolvedValue('hashed-password'),
      equals: jest.fn(),
    };

    mockEventEmitter = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: HashService, useValue: mockHashService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user and return an access token', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
      };

      // Simulate that no user exists with the given email.
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(null);

      // Simulate that the user is created successfully.
      const createdUser: User = {
        id: '3213213-432432-432432',
        email: signUpDto.email,
        password: 'hashed-password',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      (mockUsersService.create as jest.Mock).mockResolvedValue(createdUser);

      // Act
      const result = await authService.signUp(signUpDto);

      // Assert
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signUpDto.email);
      expect(mockHashService.hash).toHaveBeenCalledWith(signUpDto.password);
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: signUpDto.email,
          password: 'hashed-password',
        }),
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        UserSignUpEventName,
        expect.objectContaining({ userId: createdUser.id }),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: createdUser.id,
        email: createdUser.email,
      });
      expect(result).toEqual({ access_token: 'mock-token' });
    });

    it('should throw UnprocessableEntityException if email already exists', async () => {
      // Arrange
      const signUpDto: SignUpDto = {
        email: 'existing@example.com',
        password: 'password',
      };

      const existingUser: User = {
        id: '3213213-432432-432432',
        email: signUpDto.email,
        password: 'some-password',
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );

      // Act & Assert
      await expect(authService.signUp(signUpDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(signUpDto.email);
    });
  });

  describe('login', () => {
    it('should log in an existing user and return an access token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const existingUser: User = {
        id: '3213213-432432-432432',
        email: loginDto.email,
        password: loginDto.password,
        updatedAt: new Date(),
        createdAt: new Date(),
      };
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );
      (mockHashService.equals as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockHashService.equals).toHaveBeenCalledWith(
        loginDto.password,
        existingUser.password,
      );
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        UserLoginEventName,
        expect.objectContaining({ userId: existingUser.id }),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: existingUser.id,
        email: existingUser.email,
      });
      expect(result).toEqual({ access_token: 'mock-token' });
    });

    it('should throw UnauthorizedException if user with email is not found', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };

      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const existingUser: User = {
        id: '3213213-321321-dadsa',
        email: loginDto.email,
        password: 'hashed-password',
      } as User;
      (mockUsersService.getByEmail as jest.Mock).mockResolvedValue(
        existingUser,
      );
      (mockHashService.equals as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.getByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockHashService.equals).toHaveBeenCalledWith(
        loginDto.password,
        existingUser.password,
      );
    });
  });
});
