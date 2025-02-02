import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: signInDto) {
        return this.authService.signIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req){
        return req.user;
    }
}
