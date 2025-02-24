import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StreamRecordingStopCommand } from '../commands/stream-recording-stop.command';
import { StopRecordingDto } from '../dto/stop-recording.dto';

@Controller('stream/record')
export class RecorderController {
  constructor(private commandBus: CommandBus) {}

  @Post('stop')
  async stop(@Body() stopRecordingDto: StopRecordingDto) {
    return this.commandBus.execute(
      new StreamRecordingStopCommand(stopRecordingDto.channelName, stopRecordingDto.platform),
    );
  }
}
