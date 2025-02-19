import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, Query, ConflictException, ParseArrayPipe, Res, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('PlaylistCover'))
  create(@UploadedFile() PlaylistCover: Express.Multer.File, @Body() createPlaylistDto: CreatePlaylistDto, @Query('owner') owner: string) {
    const { buffer, originalname, mimetype } = PlaylistCover;

    return this.playlistsService.create(createPlaylistDto, +owner, buffer);
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

  @UseGuards(AuthGuard)
  @Post('add')
  async addTrackToPlaylistv2(@Query('trackId', new ParseArrayPipe({items: Number, separator: ','})) trackId: number[], @Query('playlistIds', new ParseArrayPipe({items: Number, separator: ','})) playlistIds: number[], @Req() req, @Res() res) {
    try{
      const resp = await this.playlistsService.addTracksToPlaylists(trackId, playlistIds, req.user.sub);

      let responseMessage;

      if(resp.invalid.length > 0){
        responseMessage = {
          status: 'partial_success',
          message: resp.invalid.length
            ? `Track added to ${resp.valid.length} playlists. Skipped ${resp.invalid.length} unauthorized playlists.`
            : `Track successfully added to all selected playlists.`,
          addedTo: resp.valid,
          skipped: resp.invalid,
        };
      }else{
        responseMessage = {
          status: 'success',
          message: 'Successfully added track to playlists',
          addedTo: resp.valid,
        };
      }

      return res.status(207).json(responseMessage);

    }catch (e) {
      throw e;
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
