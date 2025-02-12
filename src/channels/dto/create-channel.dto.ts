import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  platform: string;

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  @IsOptional()
  startAt: Date;

  @IsDateString()
  @IsOptional()
  endAt: Date;
}
