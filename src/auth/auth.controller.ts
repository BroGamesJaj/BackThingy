import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { RefreshGuard } from './refresh.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: signInDto) {
        try{
            return this.authService.signIn(signInDto);
        }catch {
            throw new UnauthorizedException('Invalid email or password');
        }
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Req() req){
        const user = await this.usersService.findUserById(req.user.sub);
        delete user.Password;
        return user;
    }

    @UseGuards(RefreshGuard)
    @Get('refresh')
    async refreshTokens(@Req() req) {
        try {
            return this.authService.generateTokens(req.user);
          } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
          }
    }
}
