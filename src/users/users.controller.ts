import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, NotFoundException, UseGuards, Req, ForbiddenException, UseInterceptors, UploadedFile, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    try{
      const user = this.usersService.create(createUserDto);
      return user;
    }catch(e){
      throw new ConflictException(e.message);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/other/:id')
  async findOutsideUser(@Param('id') id: string){
    const user = await this.usersService.findOutsideUser(+id);
    if(!user) throw new NotFoundException('No user found');
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('pic/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('id') id: string, @Req() req) {
    if(req.user.sub != id){
      throw new ForbiddenException("You can only change your own profile");
    }

    const { buffer, originalname, mimetype } = file;

    const user = await this.usersService.handleFileUpload(buffer, originalname, mimetype, +id);
    delete user.Password;
    return user;
  }

  @UseGuards(AuthGuard)
  @Get('/pfp/:id')
  async findPfp(@Param('id') id: string){
    const user = await this.usersService.findUserById(+id);
    if(!user) throw new NotFoundException(`No user with #${id} found`);
    return { Pfp: user.Pfp };
  }

  @Get(':id')
  async findOne(@Param('Email') Email: string) {
    const user = await this.usersService.findOne(Email);
    if(!user) throw new NotFoundException(`No user with email ${Email} found`);
    return user;
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: { Description?: string, Pfp?: Buffer }, @Req() req) {
    if(req.user.sub != id){
      throw new ForbiddenException("You can only change your own profile");
    }
    const user = await this.usersService.update(+id, updateUserDto);
    delete user.Password;
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
