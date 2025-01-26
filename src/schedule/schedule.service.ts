import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  startRecording() {
    console.log('startRecording');
  }
}
