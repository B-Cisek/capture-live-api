import { StreamRecorder } from '../interfaces/stream-recorder.interface';

export class KickRecorder implements StreamRecorder {
  startRecording(): void {
    console.log('Starting Kick stream recording...');
    // Implementation for starting Kick recording
  }

  stopRecording(): void {
    console.log('Stopping Kick stream recording...');
    // Implementation for stopping Kick recording
  }
}
