import { Body, Controller, Logger, Post } from '@nestjs/common';
import { RecorderService } from '../services/recorder.service';

@Controller('stream/record')
export class RecorderController {
  constructor(
    private readonly twitch: RecorderService,
    private readonly logger: Logger,
  ) {}

  @Post('stop')
  async stop(@Body('name') name: string) {
    this.logger.log(name);
    return 'ok';
  }
}
