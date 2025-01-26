import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import mongodb from '../config/mongodb';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StreamsModule } from './streams/streams.module';
import { SharedModule } from './shared/shared.module';
import { RecorderModule } from './recorder/recorder.module';
import { ScheduleModule as ScheduleModuleCore } from '@nestjs/schedule';
import { DirectoryModule } from './directory/directory.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(mongodb()),
    EventEmitterModule.forRoot(),
    ScheduleModuleCore.forRoot(),
    AuthModule,
    UsersModule,
    StreamsModule,
    SharedModule,
    RecorderModule,
    DirectoryModule,
    ScheduleModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
