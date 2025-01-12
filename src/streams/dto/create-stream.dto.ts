import { IsBooleanString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsDateString } from 'class-validator';
import { IsString } from 'class-validator';

export class CreateStreamDto {
  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsNotEmpty()
  @IsString()
  channel: string;

  @IsBooleanString()
  isActive: boolean;

  @IsDateString()
  @IsOptional()
  startAt: Date;

  @IsDateString()
  @IsOptional()
  endAt: Date;
}
