import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

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
    getProfile(@Req() req){
        console.log(req.user);
        return req.user;
    }
}
