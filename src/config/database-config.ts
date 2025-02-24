import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { Channel } from '../channel/entities/channel.entity';
import { Platform } from '../channel/entities/platform.entity';
import { BlacklistedToken } from '../auth/entities/blacklisted-token.entity';
import { RecordingProcess } from '../stream-recorder/entities/RecordingProcess.entity';

const config = new ConfigService();

export const databaseConfig = (): Partial<TypeOrmModuleOptions> => ({
  type: 'postgres',
  port: parseInt(config.get<string>('DATABASE_PORT', '5432'), 10),
  username: config.get<string>('DATABASE_USER', ''),
  password: config.get<string>('DATABASE_PASSWORD', ''),
  database: config.get<string>('DATABASE_NAME', 'app'),
  entities: [User, Channel, Platform, BlacklistedToken, RecordingProcess],
  synchronize: config.get<string>('APP_ENV') === 'development',
});
