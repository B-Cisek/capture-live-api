import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database-config';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChannelModule } from './channel/channel.module';
import { SharedModule } from './shared/shared.module';
import { StreamRecorderModule } from './stream-recorder/stream-recorder.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StorageModule } from './storage/storage.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CqrsModule.forRoot(),
    UsersModule,
    AuthModule,
    ChannelModule,
    SharedModule,
    StreamRecorderModule,
    StorageModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
