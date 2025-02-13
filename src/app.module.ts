import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from './config/database-config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChannelsModule } from './channels/channels.module';
import { SharedModule } from './shared/shared.module';
import { StreamRecorderModule } from './stream-recorder/stream-recorder.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig()),
    EventEmitterModule.forRoot(),
    UsersModule,
    AuthModule,
    ChannelsModule,
    SharedModule,
    StreamRecorderModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
