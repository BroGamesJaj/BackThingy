import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { SearchResultsDto } from './dto/searchresponse.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: "Returns possible searchable items based on the term" })
  @ApiOkResponse({
    description: "Succesful search",
    type: SearchResultsDto
  })
  findAll(@Query('term') term: string, @Query('userId') userId?: string) {
    return this.searchService.findAll(term.trim(), +userId);
  }

  @Get('/playlist')
  @ApiOperation({ summary: "Returns possible searchable playlists based on the term" })
  @ApiOkResponse({
    description: "Succesful search in playlists",
    type: Playlist,
    isArray: true
  })
  searchPlaylist(@Query('term') term: string, @Query('userId') userId?: string) {
    return this.searchService.playlistSearch(term.trim(), +userId);
  }
}
