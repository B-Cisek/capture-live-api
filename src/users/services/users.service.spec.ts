import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by ID', async () => {
    const user = { id: '1', email: 'test@example.com' } as User;
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await service.getById('1');
    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
  });

  it('should return a user by email', async () => {
    const user = { id: '1', email: 'test@example.com' } as User;
    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await service.getByEmail('test@example.com');
    expect(result).toEqual(user);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
  });

  it('should create and return a new user', async () => {
    const user = { id: '1', email: 'test@example.com' } as User;
    mockUserRepository.save.mockResolvedValue(user);

    const result = await service.create(user);
    expect(result).toEqual(user);
    expect(mockUserRepository.save).toHaveBeenCalledWith(user);
  });
});
