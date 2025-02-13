import { Logger, Module } from '@nestjs/common';
import { RecorderService } from './services/recorder.service';
import { RecorderController } from './controllers/recorder.controller';

@Module({
  providers: [RecorderService, Logger],
  controllers: [RecorderController],
  exports: [],
})
export class StreamRecorderModule {}
