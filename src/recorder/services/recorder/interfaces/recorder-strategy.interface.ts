import { Provider } from '../enums/provider';
import { ObjectId } from 'mongodb';

export interface RecorderStrategy {
  start(channelName: string, provider: Provider): void;
  stop(channelName: string, provider: Provider): void;
  isRecording(channelName: string, provider: Provider): boolean;
  getActiveRecordings(): RecordingProcess[];
  getStrategyName(): string;
}

export type RecordingProcess = {
  _id: ObjectId;
  channelName: string;
  provider: Provider;
  pid: number;
  createdAt: Date;
};
