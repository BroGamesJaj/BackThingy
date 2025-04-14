import { ApiProperty } from '@nestjs/swagger';

class PartialSuccessResponse {
  @ApiProperty({ example: 'partial_success' })
  status: string;

  @ApiProperty({
    example: 'Track added to 2 playlists. Skipped 1 unauthorized playlist.',
  })
  message: string;

  @ApiProperty({
    description: 'IDs of playlists where tracks were successfully added',
    type: [Number],
  })
  addedTo: number[];

  @ApiProperty({
    description: 'IDs of playlists that were skipped (e.g., unauthorized)',
    type: [Number],
    required: false,
  })
  skipped?: number[];
}

class FullSuccessResponse {
  @ApiProperty({ example: 'success' })
  status: string;

  @ApiProperty({ example: 'Successfully added track to playlists' })
  message: string;

  @ApiProperty({ type: [Number] })
  addedTo: number[];
}

// If you want to unify both cases:
export class AddTrackMultiStatusDto {
  @ApiProperty({ example: 'partial_success', enum: ['success', 'partial_success'] })
  status: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [Number] })
  addedTo: number[];

  @ApiProperty({ type: [Number], required: false })
  skipped?: number[];
}