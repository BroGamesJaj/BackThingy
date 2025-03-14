import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PrismaService } from '../prisma.service';
import { Playlist } from './entities/playlist.entity';
import axios from 'axios';
import { connect } from 'http2';

@Injectable()
export class PlaylistsService {
  db: PrismaService;

  constructor(db: PrismaService) {
    this.db = db;
  }

  create(createPlaylistDto: CreatePlaylistDto, OwnerID: number, PlaylistCover?: Buffer) {
    return this.db.playlist.create({
      data: {
        ...createPlaylistDto,
        Owner: { connect: { UserID: OwnerID } },
        PlaylistCover: PlaylistCover ? PlaylistCover : null,
        Private: createPlaylistDto.Private === "true"? true: false
      }
    });
  }

  async findAll(OwnerID: number) {
    const playlist = await this.db.playlist.findMany({
      where: { OwnerID: OwnerID },
      include: { Tracks: true }
    });

    if (!playlist) throw new NotFoundException('No playlists found');

    return playlist;
  }

  async attachTracksToPlaylists(playlists: Playlist[]) {
    const ids = Array.from(new Set(playlists.flatMap((playlist) => playlist.Tracks.map((track) => track.SongID))));

    if (ids.length === 0) return playlists;

    const querry = ids.map((id) => `id[]=${id}`).join('&');
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=8b1de417&format=jsonpretty&${querry}$limit=${ids.length}`;

    try {
      const response = await axios.get(url);
      const tracks = response.data.results;

      const trackMap = new Map(tracks.map((track) => [+track.id, track]));

      return playlists.map((playlist) => ({
        ...playlist,
        Tracks: playlist.Tracks.map((track) => trackMap.get(track.SongID) || track)
      }));

    } catch {
      throw new HttpException('Error fetching tracks', HttpStatus.BAD_GATEWAY);
    }
  }

  async attachTracksToPlaylist(PlaylistID: number) {

    const playlist = await this.db.playlist.findUnique({
      where: { PlaylistID },
      include: {
        Tracks: true,
        Owner: { select: { Username: true } }
      }
    })

    const ids = playlist.Tracks.map((track) => track.SongID);

    if (ids.length === 0) return playlist;

    const querry = ids.map((id) => `id[]=${id}`).join('&');
    const url = `https://api.jamendo.com/v3.0/tracks/?client_id=8b1de417&format=jsonpretty&${querry}&limit=${ids.length}`;

    try {
      const response = await axios.get(url);
      const tracks = response.data.results;

      const trackMap = new Map(tracks.map((track) => [+track.id, track]));

      const newP = {
        ...playlist,
        Tracks: playlist.Tracks.map((track) => trackMap.get(track.SongID) || track)
      }

      return newP;

    } catch {
      throw new HttpException('Error fetching tracks', HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: number) {
    try {
      const playlist = await this.db.playlist.findUnique({
        where: { PlaylistID: id },
        include: { Tracks: true }
      })
      if (playlist) return playlist;
      return undefined;
    } catch { return undefined }
  }

  async addTrackToPlaylist(playlistId: number, trackId: number) {

    const track = await this.db.track.findFirst({
      where: { PlaylistID: playlistId, SongID: trackId }
    });

    if (track) throw new ConflictException('Track already in playlist');

    return await this.db.track.create({
      data: {
        SongID: trackId,
        PlaylistID: playlistId
      }
    })
  }

  async addTracksToPlaylists(trackIds: number[], playlistIds: number[], userId: number) {
    const users = await this.db.playlist.findMany({
      where: {
        OwnerID: userId,
        PlaylistID: { in: playlistIds }
      },
      select: { PlaylistID: true }
    });

    const valid = users.map((o) => o.PlaylistID);

    if (!valid.length) throw new UnauthorizedException('You have not listed playlists that are yours');

    const invalid = playlistIds.filter((id) => !valid.includes(id));

    const trackPlaylistData = trackIds.flatMap(trackId =>
      valid.map(playlistId => ({
        SongID: trackId,
        PlaylistID: playlistId
      }))
    );

    await this.db.track.createMany({
      data: trackPlaylistData,
      skipDuplicates: true
    });

    return { valid, invalid };
  }

  async removeTrackFromPlaylist(playlistId: number, trackId: number) {

    return await this.db.track.delete({
      where: {
        SongID_PlaylistID: {
          SongID: trackId,
          PlaylistID: playlistId,
        },
      }
    })

  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    try{
      return await this.db.playlist.update({
        where: { PlaylistID: id },
        data: updatePlaylistDto
      })
    }catch { return undefined }
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
