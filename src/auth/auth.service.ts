import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/signIn.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: signInDto): Promise<any> {
        const user = await this.usersService.findOne(signInDto.Email);
        if(await argon2.verify(user.Password, signInDto.Password)){
            const payload = { sub: user.UserID, email: user.Email, userName: user.Username }

            const accessToken = this.jwtService.sign(payload);

            return accessToken;
        }else{
            throw new UnauthorizedException();
        }
    }
}
