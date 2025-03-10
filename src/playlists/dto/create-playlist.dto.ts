import { IsNotEmpty, IsString } from "class-validator";

export class CreatePlaylistDto {
    @IsNotEmpty()
    @IsString()
    PlaylistName: string;
    
    Owner: null;
    Description: string | null;
    Private: string;
}
