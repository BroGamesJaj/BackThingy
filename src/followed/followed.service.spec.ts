import { Test, TestingModule } from '@nestjs/testing';
import { FollowedService } from './followed.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('FollowedService', () => {
  let service: FollowedService;
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
      providers: [
        FollowedService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<FollowedService>(FollowedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
