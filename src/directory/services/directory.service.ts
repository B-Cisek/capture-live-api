import { Injectable } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

@Injectable()
export class DirectoryService {
  private readonly storageBasePath: string;

  constructor() {
    this.storageBasePath = this.storageBasePath = path.resolve(
      __dirname,
      '../../../storage',
    );
  }

  getVideoDirectory(): string {
    const videoPath = path.join(this.storageBasePath, 'video');
    this.ensureDirectoryExists(videoPath);
    return videoPath;
  }

  getOutputPathForVideo(filename: string): string {
    return path.join(this.getVideoDirectory(), filename);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
