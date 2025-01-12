import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStreamDto } from '../dto/create-stream.dto';
import { UpdateStreamDto } from '../dto/update-stream.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Stream, StreamStatus } from '../entities/stream.entity';
import { Platform } from '../entities/platform.entity';
import { ObjectId } from 'mongodb';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Order, PageOptionsDto } from '../../shared/paginator/page-options.dto';
import { PageDto } from '../../shared/paginator/page.dto';
import { PageMetaDto } from '../../shared/paginator/page-meta.dto';

@Injectable()
export class StreamsService {
  constructor(
    @InjectRepository(Stream) private streamsRepository: Repository<Stream>,
  ) {}

  async create(
    createStreamDto: CreateStreamDto,
    userId: string,
  ): Promise<Stream> {
    const entity = new Stream();
    entity.channel = createStreamDto.channel;
    entity.status = StreamStatus.READY;
    entity.isActive = createStreamDto.isActive || false;
    entity.startAt = createStreamDto.startAt || null;
    entity.endAt = createStreamDto.endAt || null;
    entity.userId = new ObjectId(userId);
    entity.platform = new Platform(
      createStreamDto.platform,
      'https://www.twitch.tv', // TODO:
    );

    return await this.streamsRepository.save(entity);
  }

  async findAll(
    userId: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Stream>> {
    const skip = pageOptionsDto.skip || 0;
    const take = pageOptionsDto.take || 10;
    const sortOrder = pageOptionsDto.order || Order.ASC;

    const [data, total] = await this.streamsRepository.findAndCount({
      where: { userId: new ObjectId(userId) },
      order: { createdAt: sortOrder },
      skip,
      take: take,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptionsDto,
      itemCount: total,
    });

    return new PageDto(data, pageMetaDto);
  }

  async findOne(id: string, userId: string): Promise<Stream> {
    try {
      return await this.streamsRepository.findOneByOrFail({
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      });
    } catch {
      throw new HttpException('Stream not found', 404);
    }
  }

  async update(
    id: string,
    userId: string,
    updateStreamDto: UpdateStreamDto,
  ): Promise<UpdateResult> {
    const stream = await this.streamsRepository.findOne({
      where: { _id: new ObjectId(id), userId: new ObjectId(userId) },
    });

    if (!stream) {
      throw new UnauthorizedException('Not authorized');
    }

    return await this.streamsRepository.update(
      new ObjectId(id),
      updateStreamDto as QueryDeepPartialEntity<Stream>,
    );
  }

  async remove(id: string, userId: string): Promise<DeleteResult> {
    const stream = await this.streamsRepository.findOne({
      where: { _id: new ObjectId(id), userId: new ObjectId(userId) },
    });

    if (!stream) {
      throw new UnauthorizedException('Not authorized');
    }

    return await this.streamsRepository.delete(new ObjectId(id));
  }
}
