import { ApiProperty } from '@nestjs/swagger';

export class SearchResultsDto {
  @ApiProperty({
    description: 'List of matching tags',
    type: [String],
    example: ['asd', 'asdfmovie', 'asds'],
  })
  tags: string[];

  @ApiProperty({
    description: 'List of matching artist names',
    type: [String],
    example: ['asdeuzicks', 'asdarbukasdacola', 'asdasf'],
  })
  artists: string[];

  @ApiProperty({
    description: 'List of matching track titles',
    type: [String],
    example: ['asdaysgoby', 'asdepique', 'asdocumentary', 'asdswamp'],
  })
  tracks: string[];

  @ApiProperty({
    description: 'List of matching album titles',
    type: [String],
    example: ['asdaysgetshorter', 'asdepique', 'asdocumentary', 'asd'],
  })
  albums: string[];

  @ApiProperty({
    description: 'List of matching playlists',
    type: [String],
    example: [],
  })
  playlists: string[];
}