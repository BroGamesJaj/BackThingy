import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsService } from './playlists.service';
import { PrismaService } from 'src/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PlaylistsService', () => {
  let service: PlaylistsService;

  const mockPrismaService = {
    playlist: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    track: {
      findFirst: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlaylistsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PlaylistsService>(PlaylistsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a playlist', async () => {
    const dto = { PlaylistName: 'Test', Private: 'false' };
    const ownerId = 1;

    mockPrismaService.playlist.create.mockResolvedValueOnce({ id: 1, ...dto });

    const result = await service.create(dto as any, ownerId);

    expect(mockPrismaService.playlist.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        PlaylistName: 'Test',
        Private: false,
        Owner: { connect: { UserID: ownerId } },
      }),
    }));
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should throw ConflictException when track already exists in playlist', async () => {
    mockPrismaService.track.findFirst.mockResolvedValueOnce({});

    await expect(service.addTrackToPlaylist(1, 100)).rejects.toThrow(ConflictException);
  });

  it('should return track when added successfully to playlist', async () => {
    mockPrismaService.track.findFirst.mockResolvedValueOnce(null);
    mockPrismaService.track.create.mockResolvedValueOnce({ SongID: 100, PlaylistID: 1 });

    const result = await service.addTrackToPlaylist(1, 100);

    expect(result).toEqual({ SongID: 100, PlaylistID: 1 });
    expect(mockPrismaService.track.create).toHaveBeenCalledWith({
      data: { SongID: 100, PlaylistID: 1 },
    });
  });

  it('should throw UnauthorizedException when trying to delete another user’s playlist', async () => {
    mockPrismaService.playlist.findUnique.mockResolvedValueOnce({
      PlaylistID: 1,
      OwnerID: 2, // Not the same as userId
      PlaylistName: 'Cool Playlist',
    });

    await expect(service.remove(1, 99)).rejects.toThrow(UnauthorizedException);
  });

  it('should update playlist with Private flag correctly', async () => {
    const dto = { PlaylistName: 'Updated', Private: 'true' };

    mockPrismaService.playlist.update.mockResolvedValueOnce({ PlaylistName: 'Updated', Private: true });

    const result = await service.update(1, dto as any);

    expect(mockPrismaService.playlist.update).toHaveBeenCalledWith({
      where: { PlaylistID: 1 },
      data: {
        PlaylistName: 'Updated',
        Private: true,
      },
    });
    expect(result).toEqual({ PlaylistName: 'Updated', Private: true });
  });
});