import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Platform } from '../channels/entities/platform.entity';

const config = new ConfigService();

export const databaseConfig = (): Partial<TypeOrmModuleOptions> => ({
  type: 'postgres',
  port: parseInt(config.get<string>('DATABASE_PORT', '5432'), 10),
  username: config.get<string>('DATABASE_USER', ''),
  password: config.get<string>('DATABASE_PASSWORD', ''),
  database: config.get<string>('DATABASE_NAME', 'app'),
  entities: [User, Channel, Platform],
  synchronize: config.get<string>('APP_ENV') === 'development',
});
