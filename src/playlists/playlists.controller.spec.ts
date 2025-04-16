import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';
import { PlaylistsService } from './playlists.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('PlaylistsController', () => {
  let controller: PlaylistsController;
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
      controllers: [PlaylistsController],
      providers: [PlaylistsService, 
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<PlaylistsController>(PlaylistsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
