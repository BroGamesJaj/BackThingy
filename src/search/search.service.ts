import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class SearchService {
  db: PrismaService;

  constructor(db: PrismaService) {
    this.db = db;
  }

  async playlistSearch(term: string, userId?: number) {
    const playlist: any = await this.db.$queryRaw`
    SELECT 
      p.*, 
      COALESCE(GROUP_CONCAT(
        CONCAT(
          '{"TrackID":', t.TrackID, 
          ',"SongID":', t.SongID, 
          ',"PlaylistID":', t.PlaylistID, 
          '}'
        ) SEPARATOR ','
      ), '[]') AS Tracks
    FROM playlist p
    LEFT JOIN Track t ON p.PlaylistID = t.PlaylistID
    WHERE LOWER(p.PlaylistName) LIKE LOWER(${`%${term}%`}) 
      AND p.Private = false 
      ${userId ? Prisma.sql`AND p.OwnerID != ${userId}` : Prisma.empty}
    GROUP BY p.PlaylistID;
  `;
    if(playlist.length < 1) throw new NotFoundException(`Couldn't find playlist with the trem "${term}"`);

    return playlist.map(p => ({
      ...p,
      Tracks: p.Tracks !== '[]' ? JSON.parse(`[${p.Tracks}]`) : []
    }));
  }

  async findAll(term: string, userId?: number) {
    const playlists: any = await this.db.$queryRaw`
    SELECT PlaylistName FROM playlist 
    WHERE LOWER(PlaylistName) LIKE LOWER(${`%${term}%`}) 
      AND Private = false 
      ${userId ? Prisma.sql`AND OwnerID != ${userId}` : Prisma.empty}
  `;

    const url = `https://api.jamendo.com/v3.0/autocomplete/?client_id=8b1de417&format=jsonpretty&limit=3&prefix=${term}`;

    const names = playlists.map((playlist) => playlist.PlaylistName);

    try {
      const response = await axios.get(url);
      const res = response.data.results;
      return {
        ...res,
        playlists: names
      }
    } catch {
      return playlists;
    }

  }
}