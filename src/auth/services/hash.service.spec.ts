import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash the password properly', async () => {
    const password = 'testPassword';
    const hashedPassword = await service.hash(password);
    // The hashed password should be a string and should not equal the plain password
    expect(typeof hashedPassword).toBe('string');
    expect(hashedPassword).not.toEqual(password);
  });

  it('should validate a correct password against its hash', async () => {
    const password = 'testPassword';
    const hashedPassword = await service.hash(password);
    const isValid = await service.equals(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  it('should not validate an incorrect password against a hash', async () => {
    const password = 'testPassword';
    const hashedPassword = await service.hash(password);
    const isValid = await service.equals('wrongPassword', hashedPassword);
    expect(isValid).toBe(false);
  });
});
