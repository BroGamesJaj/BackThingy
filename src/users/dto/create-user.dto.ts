import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "The users email address",
        example: "example@email.com"
    })
    @IsNotEmpty()
    @IsEmail()
    Email: string;

    @ApiProperty({
        description: "The users user name",
        example: "Example User"
    })
    @IsNotEmpty()
    @IsString()
    Username: string;

    @ApiProperty({
        description: "The users password",
        example: "examplePassword123"
    })
    @IsNotEmpty()
    @IsString()
    Password: string;
}
