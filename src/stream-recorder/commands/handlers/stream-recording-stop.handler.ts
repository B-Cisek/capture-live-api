import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { StreamRecordingStopCommand } from '../stream-recording-stop.command';

@CommandHandler(StreamRecordingStopCommand)
export class StreamRecordingStopHandler implements ICommandHandler<StreamRecordingStopCommand> {
  execute(command: StreamRecordingStopCommand): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
