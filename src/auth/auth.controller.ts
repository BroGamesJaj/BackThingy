import { Controller, HttpCode, HttpStatus, Post, Body, UseGuards, Req, Get, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signIn.dto';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { RefreshGuard } from './refresh.guard';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/loginresponse.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: "Log in to a user" })
    @ApiOkResponse({
        description: "Successful login",
        type: LoginResponseDto
    })
    signIn(@Body() signInDto: signInDto) {
        try {
            return this.authService.signIn(signInDto);
        } catch {
            throw new UnauthorizedException('Invalid email or password');
        }
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiOperation({ summary: "Get the data of a user" })
    @ApiOkResponse({
        description: "The data of the user succefully returned",
        type: User
    })
    async getProfile(@Req() req) {
        const user = await this.usersService.findUserById(req.user.sub);
        delete user.Password;
        return user;
    }

    @ApiBearerAuth()
    @UseGuards(RefreshGuard)
    @Get('refresh')
    @ApiOperation({ summary: "Refresh the tokens" })
    @ApiOkResponse({
        description: "Tokens successfully refreshed",
        type: LoginResponseDto
    })
    async refreshTokens(@Req() req) {
        try {
            return this.authService.generateTokens(req.user);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
