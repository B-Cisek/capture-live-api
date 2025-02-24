export class StreamRecordingStartCommand {
  constructor(
    public readonly channelName: string,
    public readonly platform: string,
  ) {}
}
