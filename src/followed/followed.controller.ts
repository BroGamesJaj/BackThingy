import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, BadGatewayException, HttpCode } from '@nestjs/common';
import { FollowedService } from './followed.service';
import { CreateFollowedDto } from './dto/create-followed.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Followed } from './entities/followed.entity';

@Controller('followed')
export class FollowedController {
  constructor(private readonly followedService: FollowedService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: "Creates a new Follow" })
  @ApiOkResponse({
    description: "The follow has been successfully created",
    type: Followed
  })
  create(@Body() createFollowedDto: CreateFollowedDto, @Req() req) {
    return this.followedService.create(createFollowedDto, req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: "Returns the authenticated users follows" })
  @ApiOkResponse({
    description: "Users follows successfully returned",
    type: Followed,
    isArray: true
  })
  findAll(@Req() req) {
    return this.followedService.findAll(req.user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(200)
  @Delete(':id')
  @ApiOperation({ summary: "Deletes a follow" })
  @ApiOkResponse({
    description: "Users follow successfully deleted"
  })
  async remove(@Param('id') id: string, @Req() req) {
    try {
      await this.followedService.remove(+id);
    } catch {
      throw new BadGatewayException("The requested entity doesn't exist");
    }
  }
}
