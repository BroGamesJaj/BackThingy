import { Test, TestingModule } from '@nestjs/testing';
import { FollowedService } from './followed.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('FollowedService', () => {
  let service: FollowedService;

  const mockPrismaService = {
    playlist: {
      findUnique: jest.fn(),
    },
    followed: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowedService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FollowedService>(FollowedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw NotFoundException if playlist does not exist when following', async () => {
    const dto = { Type: 'Playlist' as ("Playlist" | "Album" | "Artist"), FollowedID: 123 };

    mockPrismaService.playlist.findUnique.mockResolvedValueOnce(null);

    await expect(service.create(dto, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if user tries to follow their own playlist', async () => {
    const dto = { Type: 'Playlist' as ("Playlist" | "Album" | "Artist"), FollowedID: 123 };

    mockPrismaService.playlist.findUnique.mockResolvedValueOnce({
      PlaylistID: 123,
      OwnerID: 1,
      Private: false,
    });

    await expect(service.create(dto, 1)).rejects.toThrow(BadRequestException);
  });

  it('should create a follow entry for a public playlist not owned by the user', async () => {
    const dto = { Type: 'Playlist' as ("Playlist" | "Album" | "Artist"), FollowedID: 123 };

    mockPrismaService.playlist.findUnique.mockResolvedValueOnce({
      PlaylistID: 123,
      OwnerID: 2,
      Private: false,
    });

    mockPrismaService.followed.create.mockResolvedValueOnce({
      UserID: 1,
      PlaylistID: 123,
      Type: 'Playlist',
    });

    const result = await service.create(dto, 1);

    expect(result).toEqual({
      UserID: 1,
      PlaylistID: 123,
      Type: 'Playlist',
    });

    expect(mockPrismaService.followed.create).toHaveBeenCalledWith({
      data: {
        UserID: 1,
        PlaylistID: 123,
        Type: 'Playlist',
      },
    });
  });

  it('should return a user\'s followed entries (excluding private playlists)', async () => {
    const mockFollows = [
      { UserID: 1, Type: 'Playlist', Playlist: { Private: false } },
      { UserID: 1, Type: 'Artist' },
    ];

    mockPrismaService.followed.findMany.mockResolvedValueOnce(mockFollows);

    const result = await service.findAll(1);

    expect(result).toEqual(mockFollows);
    expect(mockPrismaService.followed.findMany).toHaveBeenCalledWith({
      where: {
        UserID: 1,
        OR: [
          { Type: 'Playlist', Playlist: { Private: false } },
          { NOT: { Type: 'Playlist' } },
        ],
      },
    });
  });
});