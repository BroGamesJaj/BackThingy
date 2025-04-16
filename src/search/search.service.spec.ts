import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SearchService', () => {
  let service: SearchService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return parsed playlists from playlistSearch', async () => {
    const mockData = [
      {
        PlaylistID: 1,
        PlaylistName: 'Chill Vibes',
        Tracks: '{"TrackID":1,"SongID":2,"PlaylistID":1},{"TrackID":2,"SongID":3,"PlaylistID":1}',
      }
    ];
    mockPrismaService.$queryRaw.mockResolvedValueOnce(mockData);

    const result = await service.playlistSearch('chill');

    expect(result).toEqual([
      {
        PlaylistID: 1,
        PlaylistName: 'Chill Vibes',
        Tracks: [
          { TrackID: 1, SongID: 2, PlaylistID: 1 },
          { TrackID: 2, SongID: 3, PlaylistID: 1 },
        ],
      },
    ]);
  });

  it('should throw NotFoundException if no playlist is found', async () => {
    mockPrismaService.$queryRaw.mockResolvedValueOnce([]);

    await expect(service.playlistSearch('noresult')).rejects.toThrow(NotFoundException);
  });

  it('should return playlists and autocomplete results from findAll', async () => {
    const term = 'rock';
    const mockPlaylistData = [{ PlaylistName: 'Rock Classics' }];
    const mockApiResponse = {
      data: {
        results: ['rock', 'rockstar', 'rock and roll'],
      }
    };

    mockPrismaService.$queryRaw.mockResolvedValueOnce(mockPlaylistData);
    mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

    const result = await service.findAll(term);

    expect(result).toEqual({
      playlists: ['Rock Classics'],
      ...mockApiResponse.data.results
    });
  });
});