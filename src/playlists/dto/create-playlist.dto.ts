import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePlaylistDto {

    @ApiProperty({
        description: "The name of the playlist",
        example: "ExamplePlaylist"
    })
    @IsNotEmpty()
    @IsString()
    PlaylistName: string;
    
    Owner: null;

    @ApiProperty({
        description: "The description of the playlist",
        example: "Example description",
        required: false
    })
    Description: string | null;

    @ApiProperty({
        description: "The property that defines the playlists visibility",
        example: "true"
    })
    Private: string;
}
