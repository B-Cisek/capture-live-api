import { StreamRecorder } from './interfaces/stream-recorder.interface';

export class StreamRecorderContext {
  constructor(private readonly recorder: StreamRecorder) {}

  public startRecording(): void {
    this.recorder.startRecording();
  }

  public stopRecording(): void {
    this.recorder.stopRecording();
  }
}
