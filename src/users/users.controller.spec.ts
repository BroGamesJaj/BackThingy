import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService;
  const mockPrismaService = {
    create: jest.fn(),
    findPfp: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }

  const mockJwtService = {
    findPfp: jest.fn(),
    update: jest.fn(),
  }

  const mockConfigService = {
    findPfp: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    mockUsersService = {
      create: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return a user object when createUserDto is valid', async () => {
      const createUserDto: CreateUserDto = {
        Email: 'testuser@example.com',
        Username: 'testuser',
        Password: 'password123',
      };

      const result = {
        id: 1,
        ...createUserDto,
      };

      mockUsersService.create.mockResolvedValue(result);

      const response = await controller.create(createUserDto);
      expect(response).toEqual(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw a ConflictException if create fails', async () => {
      const createUserDto: CreateUserDto = {
        Email: 'testuser@example.com',
        Username: 'testuser',
        Password: 'password123',
      };

      const error = new ConflictException('User already exists');
      mockUsersService.create.mockRejectedValue(error);

      try {
        await controller.create(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
        expect(e.message).toBe(error.message);
      }
    });
  });
});
