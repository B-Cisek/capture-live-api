import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChannelService } from '../channel/channel.service';
import { PlatformName } from '../../../channel/entities/platform.entity';
import { StreamRecorderFactory } from '../../factories/stream-recorder.factory';

@Injectable()
export class RecorderService {
  constructor(
    private readonly channelService: ChannelService,
    private readonly streamRecorderFactory: StreamRecorderFactory,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  private async handleChannels() {
    const channels = await this.channelService.getDistinctChannels();
    channels.map(
      async (channel: {
        platform_name: string;
        channel_name: string;
        platform_id: string;
        channel_id: string;
      }) => {
        channels.map(async (channel) => {
          const recorder = this.streamRecorderFactory.getRecorder(channel.platform_name as PlatformName);
          await recorder.start(channel.channel_name);
        });
      },
    );
  }
}
