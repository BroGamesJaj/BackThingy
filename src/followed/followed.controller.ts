import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadGatewayException, HttpCode } from '@nestjs/common';
import { FollowedService } from './followed.service';
import { CreateFollowedDto } from './dto/create-followed.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('followed')
export class FollowedController {
  constructor(private readonly followedService: FollowedService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createFollowedDto: CreateFollowedDto, @Req() req) {
    if(req.user.sub != createFollowedDto.UserID) throw new UnauthorizedException('Stop right there criminal scum! You have violated the law!');
    return this.followedService.create(createFollowedDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.followedService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    try {
      await this.followedService.remove(+id);
    } catch {
      throw new BadGatewayException("The requested entity doesn't exist");
    }
  }
}
