import * as process from 'node:process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/users/user.entity';
import { Stream } from '../src/streams/entities/stream.entity';
import { Platform } from '../src/streams/entities/platform.entity';

export default (): Partial<TypeOrmModuleOptions> => ({
  type: 'mongodb',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '27017', 10),
  database: process.env.DATABASE_NAME ?? 'app',
  entities: [User, Stream, Platform],
  synchronize: process.env.APP_ENV !== 'production',
});
