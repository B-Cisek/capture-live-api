import { Injectable } from '@nestjs/common';
import { PlatformName } from '../../channels/entities/platform.entity';
import { StreamRecorder } from '../interfaces/stream-recorder.interface';
import { ModuleRef } from '@nestjs/core';
import { TwitchRecorder } from '../recorders/twitch-recorder';

@Injectable()
export class StreamRecorderFactory {
  constructor(private readonly moduleRef: ModuleRef) {}

  getRecorder(platform: PlatformName): StreamRecorder {
    switch (platform) {
      case PlatformName.TWITCH:
        return this.moduleRef.get(TwitchRecorder);
      // case PlatformName.YOUTUBE:
      //   return this.moduleRef.get(YoutubeRecorder);
      // case PlatformName.KICK:
      //   return this.moduleRef.get(KickRecorder);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}
