import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel, StreamStatus } from '../../../channel/entities/channel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}

  async getDistinctChannels() {
    const now = new Date();

    return await this.channelRepository
      .createQueryBuilder('channel')
      .select(['channel.id', 'channel.name', 'platform.id', 'platform.name'])
      .distinctOn(['channel.name', 'platform.id'])
      .innerJoin('channel.platform', 'platform')
      .where('channel.isActive = :isActive', { isActive: true })
      .andWhere('channel.status = :status', { status: StreamStatus.READY })
      .andWhere(
        `(channel.startAt IS NULL OR channel.startAt <= :now) 
        AND (channel.endAt IS NULL OR channel.endAt >= :now)`,
        { now },
      )
      .orderBy('channel.name, platform.id')
      .getRawMany();
  }
}
