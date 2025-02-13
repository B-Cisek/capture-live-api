import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlatformName } from '../entities/platform.entity';

export class CreateChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PlatformName)
  platform: PlatformName;

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  @IsOptional()
  startAt: Date;

  @IsDateString()
  @IsOptional()
  endAt: Date;
}
