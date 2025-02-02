import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    Email: string;

    @IsNotEmpty()
    @IsString()
    Username: string;

    @IsNotEmpty()
    @IsString()
    Password: string;
}
