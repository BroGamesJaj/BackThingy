import { Test, TestingModule } from '@nestjs/testing';
import { FollowedController } from './followed.controller';
import { FollowedService } from './followed.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('FollowedController', () => {
  let controller: FollowedController;
  let mockFollowedService;
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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowedController],
      providers: [
        { provide: FollowedService, useValue: mockFollowedService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<FollowedController>(FollowedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
