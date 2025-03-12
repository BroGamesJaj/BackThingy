import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('term') term: string, @Query('userId') userId?: string) {
    return this.searchService.findAll(term.trim(), +userId);
  }

}
