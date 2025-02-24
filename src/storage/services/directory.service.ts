import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService {
  private readonly storagePath: string;

  constructor() {
    this.storagePath = path.join(process.cwd(), 'storage');
  }

  async onModuleInit() {
    await this.createStorageDirectory();
  }

  async getPath(folderNames: string[]): Promise<string> {
    try {
      const fullPath = path.join(this.storagePath, ...folderNames);
      if (!fs.existsSync(fullPath)) {
        await fs.promises.mkdir(fullPath, { recursive: true });
      }
      return fullPath;
    } catch (error) {
      throw new Error(`Failed to create folders: ${error.message}`);
    }
  }

  private async createStorageDirectory(): Promise<void> {
    try {
      if (!fs.existsSync(this.storagePath)) {
        await fs.promises.mkdir(this.storagePath, { recursive: true });
      }
    } catch (error) {
      throw new Error(`Failed to create storage directory: ${error.message}`);
    }
  }
}
