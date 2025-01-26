import {
  RecorderStrategy,
  RecordingChannel,
} from '../interfaces/recorder-strategy.interface';
import { Recorder } from '../enums/recorder';
import { ChildProcess } from 'child_process';
import { Process } from '../helpers/process';

type RecordingProcess = {
  process: ChildProcess;
  recordingChannel: RecordingChannel;
};

export class TwitchStrategy implements RecorderStrategy {
  private readonly url: string = 'https://twitch.tv';
  private readonly outputDirectory: string;
  private recordingProcesses = new Map<string, RecordingProcess>();

  start(channelName: string): void {
    this.ensureNotRecording(channelName);

    const args: string[] = [
      `${this.url}/${channelName}`,
      '720p60',
      '-o',
      this.outputDirectory,
    ];

    const process = new Process('streamlink', args);

    process.on('error', (err) => {});

    process.on('close', (code) => {});
  }

  isRecording(channelName: string): boolean {
    return this.recordingProcesses.has(channelName);
  }
  stop(channelName: string): void {}

  getActiveRecordings(): RecordingChannel[] {
    return Array.from(this.recordingProcesses.values()).map(
      (value: RecordingProcess): RecordingChannel => value.recordingChannel,
    );
  }

  getStrategyName(): string {
    return Recorder.TWITCH;
  }

  private ensureNotRecording(channelName: string) {
    if (this.recordingProcesses.has(channelName)) {
      throw new Error(
        `Recording for channel ${channelName} is already in progress`,
      );
    }
  }
}
