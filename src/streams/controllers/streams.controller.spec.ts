import { Test, TestingModule } from '@nestjs/testing';
import { StreamsController } from './streams.controller';
import { StreamsService } from '../services/streams.service';
import { Repository } from 'typeorm';
import { Stream } from '../entities/stream.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../../auth/guards/auth.guard';

describe('StreamsController', () => {
  let controller: StreamsController;
  let streamServiceMock: Partial<StreamsService>;
  let streamRepositoryMock: Partial<Repository<Stream>>;
  let jwtServiceMock: Partial<JwtService>; // Mock JwtService

  beforeEach(async () => {
    streamServiceMock = {
      create: jest.fn(),
    };

    streamRepositoryMock = {
      create: jest.fn(),
    };

    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StreamsController],
      providers: [
        StreamsService,
        {
          provide: getRepositoryToken(Stream),
          useValue: streamRepositoryMock,
        },
        {
          provide: JwtService, // Provide the mocked JwtService
          useValue: jwtServiceMock,
        },
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
    }).compile();

    controller = module.get<StreamsController>(StreamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
