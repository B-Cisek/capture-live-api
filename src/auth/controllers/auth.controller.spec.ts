import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      signUp: jest.fn(),
      signIn: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should return an access token on successful signup', async () => {
      const signUpDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const accessToken = { access_token: 'token' };

      (mockAuthService.signUp as jest.Mock).mockResolvedValue(accessToken);

      const result = await controller.singUp(signUpDto);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(accessToken);
    });
  });

  describe('signIn', () => {
    it('should return an access token on successful signin', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const accessToken = { access_token: 'token' };

      (mockAuthService.signIn as jest.Mock).mockResolvedValue(accessToken);

      const result = await controller.singIn(signInDto);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(accessToken);
    });
  });
});
