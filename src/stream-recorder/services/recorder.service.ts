import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RecorderService {
  constructor(private readonly logger: Logger) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  private handleChannels() {
    this.logger.log('recording');
  }
}
