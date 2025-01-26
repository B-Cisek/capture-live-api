import { Test, TestingModule } from '@nestjs/testing';
import { DirectoryService } from './directory.service';
import * as path from 'node:path';
import * as fs from 'node:fs';

jest.mock('node:fs');
jest.mock('node:path');

describe('DirectoryService', () => {
  let service: DirectoryService;
  const mockStorageBasePath = '/mock/base/path';
  const mockVideoPath = '/mock/base/path/video';

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock path.resolve to return a fixed path
    (path.resolve as jest.Mock).mockReturnValue(mockStorageBasePath);
    // Mock path.join to concatenate paths with forward slash
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectoryService],
    }).compile();

    service = module.get<DirectoryService>(DirectoryService);
  });

  describe('constructor', () => {
    it('should set storageBasePath using path.resolve', () => {
      expect(path.resolve).toHaveBeenCalledWith(
        expect.any(String),
        '../../../storage',
      );
    });
  });

  describe('getVideoDirectory', () => {
    it('should return video directory path and ensure it exists', () => {
      // Mock fs.existsSync to return false (directory doesn't exist)
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      const result = service.getVideoDirectory();

      expect(result).toBe(mockVideoPath);
      expect(fs.existsSync).toHaveBeenCalledWith(mockVideoPath);
      expect(fs.mkdirSync).toHaveBeenCalledWith(mockVideoPath, {
        recursive: true,
      });
    });

    it('should not create directory if it already exists', () => {
      // Mock fs.existsSync to return true (directory exists)
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const result = service.getVideoDirectory();

      expect(result).toBe(mockVideoPath);
      expect(fs.existsSync).toHaveBeenCalledWith(mockVideoPath);
      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
  });

  describe('getOutputPathForVideo', () => {
    it('should return complete path for video file', () => {
      // Mock fs.existsSync to return true to avoid directory creation
      (fs.existsSync as jest.Mock).mockReturnValue(true);

      const filename = 'test-video.mp4';
      const result = service.getOutputPathForVideo(filename);

      expect(result).toBe(`${mockVideoPath}/${filename}`);
    });
  });
});
