import { IsNotEmpty, IsString } from 'class-validator';

export class StopRecordingDto {
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsNotEmpty() // validate platform
  platform: string;
}
