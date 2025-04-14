import { ApiProperty } from "@nestjs/swagger";

export class signInDto{
    @ApiProperty({
        description: "The email of the user",
        example: "example@email.com"
    })
    Email: string;

    @ApiProperty({
        description: "The password of the user",
        example: "examplePassword123"
    })
    Password: string;
}