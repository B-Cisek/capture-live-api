import { Module } from '@nestjs/common';
import { DirectoryService } from './services/directory.service';

@Module({
  providers: [DirectoryService],
  exports: [DirectoryService],
})
export class DirectoryModule {}
