import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  db: PrismaService;

  constructor(db: PrismaService) {
    this.db = db;
  }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.db.user.findFirst({
      where: {
        OR: [
          { Email: createUserDto.Email },
          { Username: createUserDto.Username }
        ]
      }
    });

    if (existingUser) {
      if (createUserDto.Email === existingUser.Email) {
        throw new ConflictException("Email already in use");
      } else {
        throw new ConflictException("Username already in use");
      }
    }

    const hashedPsw = await argon2.hash(createUserDto.Password);
    const newUser = await this.db.user.create({
      data: {
        ...createUserDto,
        Password: hashedPsw
      }
    });

    await this.db.playlist.create({
      data: {
        PlaylistName: "Liked",
        Owner: { connect: { UserID: newUser.UserID } },
        Private: true
      }
    })

    delete newUser.Password;

    return newUser;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(Email: string) {
    const user = await this.db.user.findUnique({
      where: { Email }
    });
    if (!user) throw new NotFoundException('No user found');
    return user;
  }

  async findUserById(id: number) {
    try {
      const user = await this.db.user.findUnique({
        where: { UserID: id }
      })
      if (user) return user;
      return undefined;
    } catch { return undefined }
  }

  async update(id: number, updateUserDto: { Description?: string, Pfp?: Buffer }) {
    try {
      return await this.db.user.update({
        where: { UserID: id },
        data: {
          Description: updateUserDto.Description,
          Pfp: updateUserDto.Pfp ? Buffer.from(updateUserDto.Pfp) : undefined,
        },
      })
    } catch { return undefined }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
