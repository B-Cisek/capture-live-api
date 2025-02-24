import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Request } from 'express';

const mockAuthService = {
  signUp: jest.fn(),
  login: jest.fn(),
  refreshToken: jest.fn(),
  blacklistToken: jest.fn(),
};

const mockRequest = {
  headers: {},
  user: { id: '1', email: 'test@example.com' },
} as unknown as Request;

const mockSignUpDto: SignUpDto = {
  email: 'test@example.com',
  password: 'password',
};
const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password',
};

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('singUp', () => {
    it('should sign up a user', async () => {
      mockAuthService.signUp.mockResolvedValue({ access_token: 'token', refresh_token: 'token' });
      const result = await authController.singUp(mockSignUpDto);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(mockSignUpDto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });

  describe('singIn', () => {
    it('should log in a user', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'token', refresh_token: 'token' });
      const result = await authController.singIn(mockLoginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });
  });

  describe('refresh', () => {
    it('should refresh a token', async () => {
      mockAuthService.refreshToken.mockResolvedValue({ access_token: 'token' });
      const result = await authController.refresh(mockRequest);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(mockRequest.user['id']);
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should blacklist a token if refresh token is present', async () => {
      mockRequest.headers.cookie = 'refresh_token=token';
      await authController.logout(mockRequest);
      expect(mockAuthService.blacklistToken).toHaveBeenCalledWith('token');
    });

    it('should not blacklist a token if no refresh token is present', async () => {
      mockRequest.headers.cookie = '';
      await authController.logout(mockRequest);
      expect(mockAuthService.blacklistToken).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return the current user payload', () => {
      const userPayload = { id: '1', email: 'test@example.com' };
      const result = authController.me(userPayload);
      expect(result).toEqual(userPayload);
    });
  });
});
