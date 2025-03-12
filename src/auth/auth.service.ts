import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { signInDto } from './dto/signIn.dto';
import { ConfigService } from '@nestjs/config';
import { generate } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signIn(signInDto: signInDto): Promise<any> {
        try {
            const user = await this.usersService.findOne(signInDto.Email);
            if (await argon2.verify(user.Password, signInDto.Password)) {
                const payload = { sub: user.UserID, email: user.Email, userName: user.Username }
                
                return await this.generateTokens(payload);
            } else {
                throw new UnauthorizedException();
            }
        }catch(e){
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async generateTokens(payload: any) {
        const { exp, iat, ...cleanPayload } = payload;
        const [accessToken, refreshToken] = await Promise.all([

            this.jwtService.signAsync(cleanPayload, {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwtService.signAsync(cleanPayload, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
            }),
        ]);
        return { accessToken, refreshToken };
      }

    async validateRefreshToken(token: string){
        return await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_REFRESH_SECRET')});
    }

}
