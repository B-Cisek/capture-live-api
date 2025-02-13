import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './channels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Channel, StreamStatus } from '../entities/channel.entity';
import { Platform } from '../entities/platform.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateChannelDto } from '../dto/create-channel.dto';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PageOptionsDto, Order } from '../../shared/paginator/page-options.dto';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { UpdateChannelDto } from '../dto/update-channel.dto';

const mockChannel: Channel = {
  id: 'channel-id',
  name: 'Test Channel',
  status: StreamStatus.READY,
  isActive: false,
  startAt: null,
  endAt: null,
  platform: {
    id: 'platform-id',
    name: 'Twitch',
    url: 'https://twitch.tv',
  },
  user: {
    id: 'user-id',
    email: 'test@example.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date(),
    channels: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockPlatform: Platform = {
  id: 'platform-id',
  name: 'Twitch',
  url: 'https://twitch.tv',
};

const mockUser: User = {
  id: 'user-id',
  email: 'test@example.com',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  channels: [],
};

const createChannelDto: CreateChannelDto = {
  name: 'Test Channel',
  platform: 'Twitch',
  isActive: false,
  startAt: null,
  endAt: null,
};

const updateChannelDto: UpdateChannelDto = {
  name: 'Updated Channel',
  isActive: true,
};

describe('ChannelsService', () => {
  let channelsService: ChannelsService;
  let channelRepository: Repository<Channel>;
  let platformRepository: Repository<Platform>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelsService,
        {
          provide: getRepositoryToken(Channel),
          useValue: {
            save: jest.fn().mockResolvedValue(mockChannel),
            findAndCount: jest.fn().mockResolvedValue([[mockChannel], 1]),
            findOneOrFail: jest.fn().mockResolvedValue(mockChannel),
            findOne: jest.fn().mockResolvedValue(mockChannel),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Platform),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(mockPlatform),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getById: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    channelsService = module.get<ChannelsService>(ChannelsService);
    channelRepository = module.get<Repository<Channel>>(
      getRepositoryToken(Channel),
    );
    platformRepository = module.get<Repository<Platform>>(
      getRepositoryToken(Platform),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(channelsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a channel', async () => {
      const result = await channelsService.create('user-id', createChannelDto);
      expect(usersService.getById).toHaveBeenCalledWith('user-id');
      expect(platformRepository.findOneBy).toHaveBeenCalledWith({
        name: createChannelDto.platform,
      });
      expect(channelRepository.save).toHaveBeenCalledWith(expect.any(Channel));
      expect(result).toEqual(mockChannel);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(usersService, 'getById').mockResolvedValue(null);
      await expect(
        channelsService.create('user-id', createChannelDto),
      ).rejects.toThrowError(HttpException);
      expect(usersService.getById).toHaveBeenCalledWith('user-id');
    });

    it('should throw HttpException if platform is not found', async () => {
      jest.spyOn(platformRepository, 'findOneBy').mockResolvedValue(null);
      await expect(
        channelsService.create('user-id', createChannelDto),
      ).rejects.toThrowError(HttpException);
      expect(platformRepository.findOneBy).toHaveBeenCalledWith({
        name: createChannelDto.platform,
      });
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of channels', async () => {
      const pageOptionsDto: PageOptionsDto = {
        page: 1,
        take: 10,
        order: Order.ASC,
        skip: 0,
      };
      const result = await channelsService.findAll('user-id', pageOptionsDto);
      expect(channelRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: 'user-id' } },
        order: { createdAt: Order.ASC },
        skip: 0,
        take: 10,
      });
      expect(result.data).toEqual([mockChannel]);
      expect(result.meta.itemCount).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should return a channel by id', async () => {
      const result = await channelsService.findOne('channel-id', 'user-id');
      expect(channelRepository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 'channel-id',
          user: {
            id: 'user-id',
          },
        },
      });
      expect(result).toEqual(mockChannel);
    });

    it('should throw HttpException if channel is not found', async () => {
      jest
        .spyOn(channelRepository, 'findOneOrFail')
        .mockRejectedValue(
          new HttpException('Channel not found', HttpStatus.BAD_REQUEST),
        );
      await expect(
        channelsService.findOne('channel-id', 'user-id'),
      ).rejects.toThrowError(HttpException);
      expect(channelRepository.findOneOrFail).toHaveBeenCalledWith({
        where: {
          id: 'channel-id',
          user: {
            id: 'user-id',
          },
        },
      });
    });
  });

  describe('update', () => {
    const userId = 'user-1';
    const channelId = 'channel-1';
    const updateDto: UpdateChannelDto = { name: 'Updated Name' };

    it('should update the channel if authorized', async () => {
      const mockChannel = new Channel();
      mockChannel.id = channelId;
      mockChannel.user = { id: userId } as any;

      jest
        .spyOn(channelRepository, 'findOne')
        .mockResolvedValueOnce(mockChannel);
      jest
        .spyOn(channelRepository, 'update')
        .mockResolvedValueOnce({ affected: 1 } as UpdateResult);

      const result = await channelsService.update(channelId, userId, updateDto);
      expect(result.affected).toBe(1);
      expect(channelRepository.update).toHaveBeenCalledWith(
        channelId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a channel', async () => {
      const result = await channelsService.remove('channel-id', 'user-id');
      expect(channelRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 'channel-id',
          user: {
            id: 'user-id',
          },
        },
      });
      expect(channelRepository.delete).toHaveBeenCalledWith('channel-id');
      expect(result.affected).toEqual(1);
    });
  });
});
