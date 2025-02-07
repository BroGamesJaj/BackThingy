import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    UserID: 1,
    email: 'testuser@example.com',
    username: 'testuser',
    password: '$argon2i$v=19$m=65536,t=3,p=4$...encryptedPassword...',
    profilePicture: Buffer.from('mockProfilePicture'),
    description: 'This is a test user description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPfpForUser', () => {
    it('should return user data including profile picture if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findUserById(1);
      expect(result).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { UserID: 1 },
      });
    });

    it('should return undefined if no user found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findUserById(999);
      expect(result).toBeUndefined();
    });

    it('should return undefined if an error occurs', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(new Error('Database error'));

      const result = await service.findUserById(1);
      expect(result).toBeUndefined();
    });
  });
});