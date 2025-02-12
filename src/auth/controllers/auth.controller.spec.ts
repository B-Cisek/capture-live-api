import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(() => Promise.resolve({ access_token: 'signed_up_token' })),
    login: jest.fn(() => Promise.resolve({ access_token: 'logged_in_token' })),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();

          request.user = { id: 1, email: 'john@example.com' };
          return true;
        },
      })
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('singUp', () => {
    it('should sign up a user and return an access token', async () => {
      const signUpDto = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const result = await authController.singUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual({ access_token: 'signed_up_token' });
    });
  });

  describe('login', () => {
    it('should log in a user and return an access token', async () => {
      const loginDto = { email: 'john@example.com', password: 'password123' };

      const result = await authController.singIn(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({ access_token: 'logged_in_token' });
    });
  });

  describe('me', () => {
    it('should return the user object from the request', () => {
      const fakeRequest = { id: 'sdsa-ewqe-ewq213', email: 'john@example.com' };

      const result = authController.me(fakeRequest as any);

      expect(result).toEqual({
        id: 'sdsa-ewqe-ewq213',
        email: 'john@example.com',
      });
    });
  });
});
