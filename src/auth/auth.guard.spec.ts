import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should throw UnauthorizedException if no token is provided', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer invalid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jwtService.verifyAsync = jest.fn().mockRejectedValue(new Error());

    await expect(authGuard.canActivate(mockContext)).rejects.toThrowError(
      UnauthorizedException,
    );
  });

  it('should add user to request if token is valid', async () => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: { authorization: 'Bearer valid-token' },
        }),
      }),
    } as unknown as ExecutionContext;

    jwtService.verifyAsync = jest.fn().mockResolvedValue({ user: 'test' });

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should correctly extract token from header', () => {
    const mockRequest = {
      headers: { authorization: 'Bearer valid-token' },
    } as Request;

    const token = authGuard['extractTokenFromHeader'](mockRequest);
    expect(token).toBe('valid-token');
  });
});
