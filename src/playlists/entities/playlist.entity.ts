import { ApiProperty } from "@nestjs/swagger";

export class Playlist {
    @ApiProperty({
        example: 2
    })
    PlaylistID: number;

    @ApiProperty({
        example: 13
    })
    OwnerID: number;

    @ApiProperty({
        example: "ExamplePlaylist"
    })
    PlaylistName: string;

    @ApiProperty({
        example: "Example description",
        required: false
    })
    Description: string | null;

    @ApiProperty({
        description: 'Image file data encoded as a Base64 string',
        example: { 'image/png': { schema: { type: 'string', format: 'binary' } } },
        required: false
    })
    PlaylistCover: Buffer | null;

    @ApiProperty({
        example: true,
    })
    Private: boolean;

    @ApiProperty({
        example: [],
    })
    Tracks: {
        PlaylistID: number;
        TrackID: number;
        SongID: number;
    }[];
}
