import { StreamRecorder } from '../interfaces/stream-recorder.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RecordingProcess } from '../entities/RecordingProcess.entity';
import { PlatformName } from '../../channels/entities/platform.entity';
import { ChannelAlreadyRecordingException } from '../exceptions/channel-already-recording.exception';
import { CommandBus } from '@nestjs/cqrs';
import { StreamRecordingStartCommand } from '../commands/stream-recording-start.command';
import { ChannelIsNotRecordingException } from '../exceptions/channel-is-not-recording.exception';
import { StreamRecordingStopCommand } from '../commands/stream-recording-stop.command';

@Injectable()
export class TwitchRecorder implements StreamRecorder {
  private recordingProcesses = new Map<string, RecordingProcess>();

  constructor(
    @InjectRepository(RecordingProcess)
    private readonly recordingProcessRepository: Repository<RecordingProcess>,
    private readonly commandBus: CommandBus,
  ) {}

  async start(channelName: string): Promise<void> {
    await this.syncRecordingProcess();

    if (this.isRecording(channelName)) {
      throw new ChannelAlreadyRecordingException();
    }

    // TODO: Check if channel with given name exists

    await this.commandBus.execute(new StreamRecordingStartCommand(channelName, PlatformName.TWITCH));
  }

  async stop(channelName: string): Promise<void> {
    await this.syncRecordingProcess();

    if (!this.isRecording(channelName)) {
      throw new ChannelIsNotRecordingException();
    }

    await this.commandBus.execute(new StreamRecordingStopCommand(channelName, PlatformName.TWITCH));
  }

  isRecording(channelName: string): boolean {
    return this.recordingProcesses.has(this.createKey(channelName, PlatformName.TWITCH));
  }

  getActiveRecordings(): RecordingProcess[] {
    return Array.from(this.recordingProcesses.values());
  }

  private async syncRecordingProcess(): Promise<void> {
    const result = await this.recordingProcessRepository.find();

    this.recordingProcesses.clear();

    result.forEach((recording: RecordingProcess) => {
      this.recordingProcesses.set(this.createKey(recording.channelName, PlatformName.TWITCH), recording);
    });
  }

  private createKey(channelName: string, platform: PlatformName): string {
    return `${channelName}_${platform}`;
  }
}
