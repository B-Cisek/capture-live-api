import { StreamRecorder } from '../interfaces/stream-recorder.interface';

export class TwitchRecorder implements StreamRecorder {
  startRecording(): void {
    console.log('Starting Twitch stream recording...');
    // Implementation for starting Twitch recording
  }

  stopRecording(): void {
    console.log('Stopping Twitch stream recording...');
    // Implementation for stopping Twitch recording
  }
}
