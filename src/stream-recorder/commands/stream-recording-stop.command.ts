export class StreamRecordingStopCommand {
  constructor(
    public readonly channelName: string,
    public readonly platform: string,
  ) {}
}
