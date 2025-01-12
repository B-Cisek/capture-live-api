import { Test, TestingModule } from '@nestjs/testing';
import { StreamsService } from './streams.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stream, StreamStatus } from '../entities/stream.entity';
import { ObjectId } from 'mongodb';
import { CreateStreamDto } from '../dto/create-stream.dto';

describe('StreamsService', () => {
  let service: StreamsService;
  let streamRepositoryMock: jest.Mocked<Partial<Repository<Stream>>>;

  beforeEach(async () => {
    streamRepositoryMock = {
      find: jest.fn(),
      save: jest.fn(),
    };

    const mockStreamData = {
      _id: new ObjectId(),
      channel: 'test-channel',
      status: StreamStatus.READY,
      isActive: false,
      startAt: new Date(),
      endAt: new Date(),
      userId: new ObjectId(),
      platform: { name: 'Twitch', url: 'https://www.twitch.tv' },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsService,
        {
          provide: getRepositoryToken(Stream),
          useValue: streamRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<StreamsService>(StreamsService);
    streamRepositoryMock = module.get(getRepositoryToken(Stream));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a stream', async () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
