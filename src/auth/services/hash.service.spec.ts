import { HashService } from './hash.service';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = app.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should generate a hash different from the original password', async () => {
      const password = 'testPassword123';
      const hash = await service.hash(password);

      expect(hash).not.toBe(password);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';

      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should use bcrypt.genSalt and bcrypt.hash', async () => {
      const genSaltSpy = jest.spyOn(bcrypt, 'genSalt');
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      const password = 'testPassword123';
      await service.hash(password);

      expect(genSaltSpy).toHaveBeenCalled();
      expect(hashSpy).toHaveBeenCalled();
    });
  });

  describe('equals', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hash = await service.hash(password);

      const result = await service.equals(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hash = await service.hash(password);

      const result = await service.equals(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should use bcrypt.compare', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare');

      const password = 'testPassword123';
      const hash = await service.hash(password);

      await service.equals(password, hash);

      expect(compareSpy).toHaveBeenCalledWith(password, hash);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
