import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, Query, ConflictException, ParseArrayPipe, Res, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, HttpCode } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('PlaylistCover'))
  create(@Body() createPlaylistDto: CreatePlaylistDto, @Req() req, @UploadedFile() PlaylistCover?: Express.Multer.File) {
    try {
      const { buffer, originalname, mimetype } = PlaylistCover || {};

      return this.playlistsService.create(createPlaylistDto, req.user.sub, buffer);
    } catch {
      throw new BadRequestException("You fucked up, thats fucked up");
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(@Req() req, @Query('includeFullTracks') includeFullTracks: boolean) {
    const playlist = await this.playlistsService.findAll(req.user.sub);

    if (includeFullTracks) {
      return await this.playlistsService.attachTracksToPlaylists(playlist);
    }

    return playlist;
  }

  @UseGuards(AuthGuard)
  @Post(':id/add/:trackId')
  async addTrackToPlaylist(@Param('id') id: string, @Param('trackId') trackId: string, @Req() req) {
    const playlist = await this.playlistsService.findOne(+id);
    if (req.user.sub != playlist.OwnerID) throw new UnauthorizedException('You can only add to your own playlist');
    try {
      return await this.playlistsService.addTrackToPlaylist(+id, +trackId);
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async addTrackToPlaylistv2(@Query('trackId', new ParseArrayPipe({ items: Number, separator: ',' })) trackId: number[], @Query('playlistIds', new ParseArrayPipe({ items: Number, separator: ',' })) playlistIds: number[], @Req() req, @Res() res) {
    try {
      const resp = await this.playlistsService.addTracksToPlaylists(trackId, playlistIds, req.user.sub);

      let responseMessage;

      if (resp.invalid.length > 0) {
        responseMessage = {
          status: 'partial_success',
          message: resp.invalid.length
            ? `Track added to ${resp.valid.length} playlists. Skipped ${resp.invalid.length} unauthorized playlists.`
            : `Track successfully added to all selected playlists.`,
          addedTo: resp.valid,
          skipped: resp.invalid,
        };
      } else {
        responseMessage = {
          status: 'success',
          message: 'Successfully added track to playlists',
          addedTo: resp.valid,
        };
      }

      return res.status(207).json(responseMessage);

    } catch (e) {
      throw e;
    }

  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('includeFullTracks') includeFullTracks: boolean) {
    if (includeFullTracks) return this.playlistsService.attachTracksToPlaylist(+id);
    return this.playlistsService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('PlaylistCover'))
  async update(@Param('id') id: string, @Req() req, @Body() updatePlaylistDto: UpdatePlaylistDto, @UploadedFile() PlaylistCover?: Express.Multer.File) {
    const playlist = await this.playlistsService.findOne(+id);
    if (!playlist) throw new BadRequestException('The thing you want to update does not exist... dumbass')
    if (req.user.sub != playlist.OwnerID) throw new UnauthorizedException('Stop right there criminal scum! You have violated the law!');

    const data: any = {}

    if (updatePlaylistDto.PlaylistName) data.PlaylistName = updatePlaylistDto.PlaylistName;
    if (updatePlaylistDto.Description) data.Description = updatePlaylistDto.Description;
    if(updatePlaylistDto.Private) data.Private = updatePlaylistDto.Private;
    if (PlaylistCover) {
      const { buffer, originalname, mimetype } = PlaylistCover;
      data.PlaylistCover = buffer;
    }

    if (!data) throw new BadRequestException("You have to update something dumbass");

    const updated = await this.playlistsService.update(+id, data);

    return updated;
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    await this.playlistsService.remove(+id, req.user.sub);
  }
}
