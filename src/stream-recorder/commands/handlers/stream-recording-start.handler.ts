import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StreamRecordingStartCommand } from '../stream-recording-start.command';

@CommandHandler(StreamRecordingStartCommand)
export class StreamRecordingStartHandler implements ICommandHandler<StreamRecordingStartCommand> {
  // @ts-ignore
  execute(command: StreamRecordingStartCommand): Promise<null> {
    console.log(command);
  }
}
