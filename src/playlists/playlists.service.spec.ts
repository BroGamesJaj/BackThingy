import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from './playlists.service';
import { PrismaService } from 'src/prisma.service';

describe('PlaylistsService', () => {
  let service: PlaylistsService;
  const mockPrismaService = {
    create: jest.fn(),
    findPfp: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
