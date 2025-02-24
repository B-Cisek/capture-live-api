import { Module } from '@nestjs/common';
import { StorageService } from './directory.service';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
