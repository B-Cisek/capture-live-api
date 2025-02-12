import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Platform } from './entities/platform.entity';
import { ChannelsService } from './services/channels.service';
import { ChannelsController } from './controllers/channels.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Platform]), UsersModule],
  providers: [ChannelsService],
  controllers: [ChannelsController],
  exports: [ChannelsService, TypeOrmModule],
})
export class ChannelsModule {}
