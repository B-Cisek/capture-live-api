import * as process from 'node:process';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

export default (): Partial<TypeOrmModuleOptions> => ({
  type: 'mongodb',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '27017', 10),
  database: process.env.DATABASE_NAME ?? 'app',
  entities: [User],
});
