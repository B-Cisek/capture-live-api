import { Module } from '@nestjs/common';
import { RecordingProcess } from './entities/recording-process.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Twitch } from './services/recorder/strategies/twich';
import { RecorderController } from './controllers/recorder.controller';
import { DirectoryModule } from 'src/directory/directory.module';

@Module({
  imports: [TypeOrmModule.forFeature([RecordingProcess]), DirectoryModule],
  providers: [Twitch],
  exports: [Twitch, TypeOrmModule],
  controllers: [RecorderController],
})
export class RecorderModule {}
