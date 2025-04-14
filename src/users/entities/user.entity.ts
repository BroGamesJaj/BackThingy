import { ApiProperty } from "@nestjs/swagger";

export class User {
    @ApiProperty({
        example: 1
    })
    UserID: number;

    @ApiProperty({
        example: "Example User"
    })
    Username: string;

    @ApiProperty({
        example: "example@email.com"
    })
    Email: string;

    @ApiProperty({
        description: 'Image file data encoded as a Base64 string',
        example: { 'image/png': { schema: { type: 'string', format: 'binary' } } },
    })
    Pfp: Buffer;

    @ApiProperty({
        example: "example description"
    })
    Description: string;
}
