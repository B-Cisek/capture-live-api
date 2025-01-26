import { Body, Controller, Post } from '@nestjs/common';
import { Twitch } from '../services/recorder/strategies/twich';
import { Provider } from '../services/recorder/enums/provider';

@Controller('record')
export class RecorderController {
  constructor(private readonly twitch: Twitch) {}

  @Post()
  async record(@Body('name') name: string) {
    await this.twitch.start(name, Provider.TWITCH);

    return 'ok';
  }

  @Post('stop')
  async stop(@Body('name') name: string) {
    await this.twitch.stop(name, Provider.TWITCH);

    return 'ok';
  }
}
