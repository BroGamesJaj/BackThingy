import { ApiProperty } from "@nestjs/swagger";

export class Followed {
    @ApiProperty({
        example: 32
    })
    FollowedID: number;

    @ApiProperty({
        example: 512
    })
    UserID: number;

    @ApiProperty({
        example: 5423,
        required: false
    })
    PlaylistID?: number;

    @ApiProperty({
        example: 12324,
        required: false
    })
    TypeID?: number;

    @ApiProperty({
        example: "Album",
    })
    Type: string;
}
