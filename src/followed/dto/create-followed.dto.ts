import { ApiProperty } from "@nestjs/swagger";

export class CreateFollowedDto {
    @ApiProperty({
        description: "The id of the followed item",
        example: 3
    })
    FollowedID: number;

    @ApiProperty({
        description: "The type of the followed item",
        example: "Playlist"
    })
    Type: "Playlist" | "Album" | "Artist";
}
