import {
  RecorderStrategy,
  RecordingProcess,
} from '../interfaces/recorder-strategy.interface';
import { Provider } from '../enums/provider';
import { Process } from '../helpers/process';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecordStartedEvent } from '../../../events/record-started.event';
import { RecordingProcess as RecordingProcessEntity } from '../../../entities/recording-process.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectoryService } from 'src/directory/services/directory.service';
import { Injectable } from '@nestjs/common';
import { ChannelAlreadyRecordingException } from '../exception/channel-already-recording.exception';

type RecordingKey = {
  channelName: string;
  provider: Provider;
};

@Injectable()
export class Twitch implements RecorderStrategy {
  private readonly url: string = 'https://twitch.tv';
  private recordingProcesses = new Map<RecordingKey, RecordingProcess>();

  constructor(
    private readonly directoryService: DirectoryService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(RecordingProcessEntity)
    private recordingProcessRepository: Repository<RecordingProcessEntity>,
  ) {}

  async start(channelName: string, provider: Provider): Promise<void> {
    await this.syncRecordingProcess();

    if (this.isRecording(channelName, provider)) {
      throw new ChannelAlreadyRecordingException();
    }

    const args: string[] = [
      `${this.url}/${channelName}`,
      '720p60', // TODO: Make this configurable
      '-o',
      this.directoryService.getOutputPathForVideo('video.mp4'),
    ];

    const process = new Process();
    process.command = 'streamlink';
    process.args = args;
    const pid = process.spawn();

    const entity = new RecordingProcessEntity();
    entity.channelName = channelName;
    entity.provider = provider;
    entity.pid = pid;

    await this.recordingProcessRepository.save(entity);

    const recordStartedEvent: RecordStartedEvent = {};
    this.eventEmitter.emit('record.started', recordStartedEvent);

    this.handleProcessEvents(process, channelName, provider);
  }

  async stop(channelName: string, provider: Provider): Promise<void> {
    await this.syncRecordingProcess();

    if (!this.isRecording(channelName, provider)) {
      throw new Error(
        `Recording for channel ${channelName} is not in progress`,
      );
    }

    const key = this.findRecordingKey(channelName, provider);
    const pid = this.recordingProcesses.get(key)?.pid as number;
    process.kill(pid);
  }

  isRecording(channelName: string, provider: Provider): boolean {
    return Array.from(this.recordingProcesses.keys()).some(
      (key) => key.channelName === channelName && key.provider === provider,
    );
  }

  getActiveRecordings(): RecordingProcess[] {
    return Array.from(this.recordingProcesses.values()).map(
      (value: RecordingProcess): RecordingProcess => value,
    );
  }

  getStrategyName(): string {
    return Provider.TWITCH;
  }

  private findRecordingKey(
    channelName: string,
    provider: Provider,
  ): RecordingKey {
    return Array.from(this.recordingProcesses.keys()).find(
      (key) => key.channelName === channelName && key.provider === provider,
    ) as RecordingKey;
  }

  private async syncRecordingProcess() {
    const result = await this.recordingProcessRepository.find();

    this.recordingProcesses.clear();

    result.forEach((recording: RecordingProcess) => {
      this.recordingProcesses.set(
        {
          channelName: recording.channelName,
          provider: recording.provider,
        },
        recording,
      );
    });
  }

  private handleProcessEvents(
    process: Process,
    channelName: string,
    provider: Provider,
  ): void {
    process.on('error', (err: any) => {
      console.error(
        `Process for ${process.command} encountered an error:`,
        err,
      );

      if (process.pid) {
        this.deleteRecordingProcess(channelName, provider);
      }
    });

    process.on('close', (code) => {
      console.log(`Process with PID ${process.pid} closed with code ${code}`);

      if (process.pid) {
        this.deleteRecordingProcess(channelName, provider);
      }
    });
  }

  private deleteRecordingProcess(channelName: string, provider: Provider) {
    const key = Array.from(this.recordingProcesses.keys()).find(
      (k) => k.channelName === channelName && k.provider === provider,
    );

    if (key) {
      this.recordingProcessRepository.delete(key);
    }
  }
}
