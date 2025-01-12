import { Module } from '@nestjs/common';
import { StreamsService } from './services/streams.service';
import { StreamsController } from './controllers/streams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stream } from './entities/stream.entity';
import { Platform } from './entities/platform.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stream, Platform]), UsersModule],
  controllers: [StreamsController],
  providers: [StreamsService],
})
export class StreamsModule {}
