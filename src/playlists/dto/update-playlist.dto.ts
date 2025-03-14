import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreatePlaylistDto } from './create-playlist.dto';

export class UpdatePlaylistDto extends PartialType(OmitType(CreatePlaylistDto, ['Private'] as const)) {}
