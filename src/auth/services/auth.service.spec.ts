import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../../user/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from './hash.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlacklistedToken } from '../entities/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../user/entities/user.entity';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  password: 'hashedPassword',
  channels: [], // Assuming channels is an array
  updatedAt: new Date(),
  createdAt: new Date(),
};

const mockSignUpDto: SignUpDto = {
  email: 'test@example.com',
  password: 'password',
};

const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password',
};

const mockBlacklistedToken = {
  token: 'hashedToken',
  expiresAt: new Date(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let hashService: HashService;
  let eventEmitter: EventEmitter2;
  let configService: ConfigService;
  let blacklistedTokenRepository: Repository<BlacklistedToken>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getByEmail: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockUser),
            getById: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }),
          },
        },
        {
          provide: HashService,
          useValue: {
            hash: jest.fn().mockResolvedValue('hashedPassword'),
            equals: jest.fn().mockResolvedValue(true),
            determineHash: jest.fn().mockReturnValue('hashedToken'),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'JWT_REFRESH_SECRET':
                  return 'refreshSecret';
                case 'JWT_REFRESH_ALGORITHM':
                  return 'HS256';
                case 'JWT_REFRESH_EXPIRE':
                  return '1h';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: getRepositoryToken(BlacklistedToken),
          useValue: {
            save: jest.fn().mockResolvedValue(mockBlacklistedToken),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    hashService = module.get<HashService>(HashService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
    configService = module.get<ConfigService>(ConfigService);
    blacklistedTokenRepository = module.get<Repository<BlacklistedToken>>(
      getRepositoryToken(BlacklistedToken),
    );
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const result = await authService.signUp(mockSignUpDto);
      expect(usersService.getByEmail).toHaveBeenCalledWith(mockSignUpDto.email);
      expect(usersService.create).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('should throw an error if email already exists', async () => {
      jest.spyOn(usersService, 'getByEmail').mockResolvedValueOnce(mockUser);
      await expect(authService.signUp(mockSignUpDto)).rejects.toThrow(UnprocessableEntityException);
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      jest.spyOn(usersService, 'getByEmail').mockResolvedValueOnce(mockUser);
      const result = await authService.login(mockLoginDto);
      expect(usersService.getByEmail).toHaveBeenCalledWith(mockLoginDto.email);
      expect(hashService.equals).toHaveBeenCalledWith(mockLoginDto.password, mockUser.password);
      expect(eventEmitter.emit).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('should throw an error if email not found', async () => {
      await expect(authService.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if password is invalid', async () => {
      jest.spyOn(usersService, 'getByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(hashService, 'equals').mockResolvedValueOnce(false);
      await expect(authService.login(mockLoginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('blacklistToken', () => {
    it('should blacklist a token', async () => {
      await authService.blacklistToken('token');
      expect(jwtService.verify).toHaveBeenCalled();
      expect(blacklistedTokenRepository.save).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh a token', async () => {
      const result = await authService.refreshToken(mockUser.id);
      expect(usersService.getById).toHaveBeenCalledWith(mockUser.id);
      expect(eventEmitter.emit).toHaveBeenCalled();
      expect(result).toHaveProperty('access_token');
      expect(result).not.toHaveProperty('refresh_token');
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(usersService, 'getById').mockResolvedValueOnce(null);
      await expect(authService.refreshToken(mockUser.id)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('clearExpiredTokens', () => {
    it('should clear expired tokens', async () => {
      await authService['clearExpiredTokens']();
      expect(blacklistedTokenRepository.delete).toHaveBeenCalled();
    });
  });
});
