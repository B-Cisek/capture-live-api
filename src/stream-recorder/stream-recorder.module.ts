import { Module } from '@nestjs/common';
import { StreamRecorderContext } from './stream-recorder.context';
import { StreamRecorderFactory } from './factories/stream-recorder.factory';
import { PlatformName } from '../channels/entities/platform.entity';

@Module({
  providers: [
    {
      provide: 'StreamRecorderContext',
      useFactory: (platform: PlatformName) => {
        const recorder = StreamRecorderFactory.createRecorder(platform);
        return new StreamRecorderContext(recorder);
      },
      inject: [],
    },
  ],
  exports: ['StreamRecorderContext'],
})
export class StreamRecorderModule {}
