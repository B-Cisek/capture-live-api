import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
describe('UsersService', () => {
  let service: UsersService;
  let mockRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users: User[] = [
        {
          _id: new ObjectId(),
          email: 'test@example.com',
          password: 'password',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (mockRepository.find as jest.Mock).mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = {
        _id: new ObjectId(),
        email,
        password: 'password',
      } as User;
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(user);

      const result = await service.getByEmail(email);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const email = 'notfound@example.com';
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.getByEmail(email);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = new ObjectId().toString();
      const objectId = new ObjectId(id);
      const user = {
        _id: objectId,
        email: 'test@example.com',
        password: 'password',
      } as User;

      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        _id: objectId,
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const id = new ObjectId().toString();
      const objectId = new ObjectId(id);
      (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(id);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        _id: objectId,
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should save and return the created user', async () => {
      const user = {
        _id: new ObjectId(),
        email: 'test@example.com',
        password: 'password',
      } as User;

      (mockRepository.save as jest.Mock).mockResolvedValue(user);

      const result = await service.create(user);

      expect(mockRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
});
