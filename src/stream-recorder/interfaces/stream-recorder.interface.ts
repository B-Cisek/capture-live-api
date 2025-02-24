import { RecordingProcess } from '../entities/RecordingProcess.entity';

export interface StreamRecorder {
  start(channelName: string): Promise<void> | void;
  stop(channelName: string): Promise<void> | void;
  isRecording(channelName: string): boolean;
  getActiveRecordings(): RecordingProcess[];
}
