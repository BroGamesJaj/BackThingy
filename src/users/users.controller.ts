import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  ConflictException, NotFoundException, UseGuards, Req,
  ForbiddenException, UseInterceptors, UploadedFile, HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam,
  ApiOkResponse
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = this.usersService.create(createUserDto);
      return user;
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'List of all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/other/:id')
  @ApiOperation({ summary: 'Get another user by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOutsideUser(@Param('id') id: string) {
    const user = await this.usersService.findOutsideUser(+id);
    if (!user) throw new NotFoundException('No user found');
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('pic/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload profile picture' })
  @ApiParam({ name: 'id', type: Number })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Profile picture uploaded' })
  @ApiResponse({ status: 403, description: 'Forbidden: Can only update your own profile' })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Req() req
  ) {
    if (req.user.sub != id) {
      throw new ForbiddenException("You can only change your own profile");
    }

    const { buffer, originalname, mimetype } = file;
    const user = await this.usersService.handleFileUpload(buffer, originalname, mimetype, +id);
    delete user.Password;
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/pfp/:id')
  @ApiOperation({ summary: 'Get user profile picture (Buffer)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'Profile picture buffer returned' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findPfp(@Param('id') id: string) {
    const user = await this.usersService.findUserById(+id);
    if (!user) throw new NotFoundException(`No user with #${id} found`);
    return { Pfp: user.Pfp };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({ name: 'Email', type: String })
  @ApiOkResponse({ description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('Email') Email: string) {
    const user = await this.usersService.findOne(Email);
    if (!user) throw new NotFoundException(`No user with email ${Email} found`);
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile (description / picture)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden: Can only update your own profile' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: { Description?: string, Pfp?: Buffer },
    @Req() req
  ) {
    if (req.user.sub != id) {
      throw new ForbiddenException("You can only change your own profile");
    }
    const user = await this.usersService.update(+id, updateUserDto);
    delete user.Password;
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ description: 'User deleted' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}