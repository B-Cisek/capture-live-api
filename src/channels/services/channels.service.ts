import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateChannelDto } from '../dto/create-channel.dto';
import { Channel, StreamStatus } from '../entities/channel.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Platform } from '../entities/platform.entity';
import { Order, PageOptionsDto } from '../../shared/paginator/page-options.dto';
import { PageDto } from '../../shared/paginator/page.dto';
import { PageMetaDto } from '../../shared/paginator/page-meta.dto';
import { UpdateChannelDto } from '../dto/update-channel.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Platform)
    private readonly platformRepository: Repository<Platform>,
    private readonly usersService: UsersService,
  ) {}

  async create(
    userId: string,
    createChannelDto: CreateChannelDto,
  ): Promise<Channel> {
    const user = await this.usersService.getById(userId);

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    const platform = await this.platformRepository.findOneBy({
      name: createChannelDto.platform,
    });

    if (!platform) {
      throw new HttpException('Platform not found', 404);
    }

    const entity = new Channel();
    entity.name = createChannelDto.name;
    entity.status = StreamStatus.READY;
    entity.isActive = createChannelDto.isActive || false;
    entity.startAt = createChannelDto.startAt || null;
    entity.endAt = createChannelDto.endAt || null;
    entity.platform = platform;
    entity.user = user;

    return this.channelRepository.save(entity);
  }

  async findAll(userId: string, pageOptionsDto: PageOptionsDto) {
    const skip = pageOptionsDto.skip || 0;
    const take = pageOptionsDto.take || 10;
    const sortOrder = pageOptionsDto.order || Order.ASC;

    const [data, total] = await this.channelRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: sortOrder },
      relations: {
        platform: true,
      },
      skip,
      take: take,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount: total,
    });

    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string, userId: string): Promise<Channel> {
    try {
      return await this.channelRepository.findOneOrFail({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });
    } catch {
      throw new HttpException('Channel not found', 404);
    }
  }

  async update(
    id: string,
    userId: string,
    updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    const channel = await this.channelRepository.findOne({
      where: { id: id, user: { id: userId } },
    });

    if (!channel) {
      throw new UnauthorizedException('Not authorized');
    }

    const updateChannelDtoPartial = {
      ...updateChannelDto,
      platform: updateChannelDto.name,
    };

    return await this.channelRepository.update(
      id,
      updateChannelDtoPartial as QueryDeepPartialEntity<Channel>,
    );
  }

  async remove(id: string, userId: string): Promise<DeleteResult> {
    const channel = await this.channelRepository.findOne({
      where: {
        id: id,
        user: {
          id: userId,
        },
      },
    });

    if (!channel) {
      throw new UnauthorizedException('Channel not found');
    }

    return await this.channelRepository.delete(id);
  }
}
