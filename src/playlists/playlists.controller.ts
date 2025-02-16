import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, Query, ConflictException } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Query('owner') owner: string) {
    return this.playlistsService.create(createPlaylistDto, +owner);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req, @Query('includeFullTracks') includeFullTracks: boolean) {
    const playlist = await this.playlistsService.findAll(req.user.sub);

    if(includeFullTracks) {
      return await this.playlistsService.attachTracksToPlaylists(playlist);
    }
    
    return playlist;
  }

  @UseGuards(AuthGuard)
  @Post(':id/add/:trackId')
  async addTrackToPlaylist(@Param('id') id: string, @Param('trackId') trackId: string, @Req() req) {
    const playlist = await this.playlistsService.findOne(+id);
    if(req.user.sub != playlist.OwnerID) throw new UnauthorizedException('You can only add to your own playlist');
    try{
      return await this.playlistsService.addTrackToPlaylist(+id, +trackId);
    }catch (e) {
      throw new ConflictException(e.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('includeFullTracks') includeFullTracks: boolean) {
    if(includeFullTracks) return this.playlistsService.attachTracksToPlaylist(+id);
    return this.playlistsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
