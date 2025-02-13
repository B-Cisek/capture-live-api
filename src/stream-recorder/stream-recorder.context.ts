import { StreamRecorder } from './interfaces/stream-recorder.interface';

export class StreamRecorderContext {
  private recorder: StreamRecorder;

  constructor(recorder: StreamRecorder) {
    this.recorder = recorder;
  }

  public startRecording(): void {
    this.recorder.startRecording();
  }

  public stopRecording(): void {
    this.recorder.stopRecording();
  }
}
