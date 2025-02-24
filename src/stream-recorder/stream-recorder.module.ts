import { Logger, Module } from '@nestjs/common';
import { RecorderController } from './controllers/recorder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordingProcess } from './entities/RecordingProcess.entity';
import { StorageModule } from 'src/storage/storage.module';
import { RecorderService } from './services/recorder/recorder.service';
import { ProcessManager } from './services/process/process-manager.service';
import { TwitchRecorder } from './recorders/twitch-recorder';
import { Channel } from '../channels/entities/channel.entity';
import { ChannelService } from './services/channel/channel.service';
import { StreamRecorderFactory } from './factories/stream-recorder.factory';
import { StreamRecordingStartHandler } from './commands/handlers/stream-recording-start.handler';

@Module({
  imports: [TypeOrmModule.forFeature([RecordingProcess, Channel]), StorageModule],
  providers: [
    RecorderService,
    Logger,
    ProcessManager,
    TwitchRecorder,
    ChannelService,
    StreamRecorderFactory,
    StreamRecordingStartHandler,
  ],
  controllers: [RecorderController],
  exports: [TypeOrmModule],
})
export class StreamRecorderModule {}
