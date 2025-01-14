import { Test, TestingModule } from '@nestjs/testing';
import { StreamsService } from './streams.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Stream, StreamStatus } from '../entities/stream.entity';
import { ObjectId } from 'mongodb';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { Order, PageOptionsDto } from '../../shared/paginator/page-options.dto';

describe('StreamsService', () => {
  let service: StreamsService;
  let repository: Repository<Stream>;

  const mockRepository = {
    save: jest.fn(),
    findAndCount: jest.fn(),
    findOneByOrFail: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreamsService,
        {
          provide: getRepositoryToken(Stream),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<StreamsService>(StreamsService);
    repository = module.get<Repository<Stream>>(getRepositoryToken(Stream));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a stream', async () => {
      const createStreamDto = {
        channel: 'testChannel',
        isActive: true,
        startAt: new Date(),
        endAt: new Date(),
        platform: 'Twitch',
      };
      const userId = '507f1f77bcf86cd799439011';
      const expectedStream = {
        ...createStreamDto,
        userId: new ObjectId(userId),
        status: StreamStatus.READY,
      };

      mockRepository.save.mockResolvedValue(expectedStream);

      const result = await service.create(createStreamDto, userId);
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'testChannel',
          status: StreamStatus.READY,
          isActive: true,
        }),
      );
      expect(result).toEqual(expectedStream);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of streams', async () => {
      const userId = new ObjectId().toString();

      const pageOptionsDto = {
        page: 1,
        take: 10,
        order: Order.ASC,
      } as PageOptionsDto;

      const streams = [{ id: '1', channel: 'testChannel' }];
      const total = 1;

      mockRepository.findAndCount.mockResolvedValue([streams, total]);

      const result = await service.findAll(userId, pageOptionsDto);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        where: { userId: new ObjectId(userId) },
        order: { createdAt: Order.ASC },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        data: streams,
        meta: expect.any(Object),
      });
    });
  });

  describe('findOne', () => {
    it('should return a stream by id', async () => {
      const id = new ObjectId().toString();
      const userId = new ObjectId().toString();
      const stream = { id, channel: 'testChannel' };

      mockRepository.findOneByOrFail.mockResolvedValue(stream);

      const result = await service.findOne(id, userId);

      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });
      expect(result).toEqual(stream);
    });

    it('should throw an exception if stream is not found', async () => {
      mockRepository.findOneByOrFail.mockRejectedValue(new Error());

      await expect(service.findOne('invalid_id', 'user_id')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should update a stream', async () => {
      const id = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439011';
      const updateStreamDto = { channel: 'updatedChannel' };

      mockRepository.findOne.mockResolvedValue({ id });
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, userId, updateStreamDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(id), userId: new ObjectId(userId) },
      });
      expect(repository.update).toHaveBeenCalledWith(
        new ObjectId(id),
        updateStreamDto,
      );
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw UnauthorizedException if stream is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(
          new ObjectId().toString(),
          new ObjectId().toString(),
          {},
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a stream', async () => {
      const id = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439011';

      mockRepository.findOne.mockResolvedValue({ id });
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(id, userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { _id: new ObjectId(id), userId: new ObjectId(userId) },
      });
      expect(repository.delete).toHaveBeenCalledWith(new ObjectId(id));
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw UnauthorizedException if stream is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.remove(new ObjectId().toString(), new ObjectId().toString()),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
