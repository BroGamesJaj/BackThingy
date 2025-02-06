import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/signIn.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(signInDto: signInDto): Promise<any> {
        try {
            const user = await this.usersService.findOne(signInDto.Email);
            if (await argon2.verify(user.Password, signInDto.Password)) {
                const payload = { sub: user.UserID, email: user.Email, userName: user.Username, Description: user.Description }

                console.log(payload);

                const accessToken = await this.jwtService.signAsync(payload);

                return { accessToken };
            } else {
                throw new UnauthorizedException();
            }
        }catch(e){
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
