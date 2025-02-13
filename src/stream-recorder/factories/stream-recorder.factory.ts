import { TwitchRecorder } from '../recorders/twitch-recorder';
import { PlatformName } from '../../channels/entities/platform.entity';
import { YouTubeRecorder } from '../recorders/youtube-recorder';
import { KickRecorder } from '../recorders/kick-recorder';
import { StreamRecorder } from '../interfaces/stream-recorder.interface';

export class StreamRecorderFactory {
  static createRecorder(platform: PlatformName): StreamRecorder {
    switch (platform) {
      case PlatformName.TWITCH:
        return new TwitchRecorder();
      case PlatformName.YOUTUBE:
        return new YouTubeRecorder();
      case PlatformName.KICK:
        return new KickRecorder();
      default:
        throw new Error('Unsupported platform');
    }
  }
}
