import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFollowedDto } from './dto/create-followed.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FollowedService {
  private db: PrismaService;

  constructor(db: PrismaService) { this.db = db; }

  async create(createFollowedDto: CreateFollowedDto, userId: number) {
    if(createFollowedDto.Type === "Playlist") {
      const playlist = await this.db.playlist.findUnique({
        where: {
          PlaylistID: createFollowedDto.FollowedID
        }
      });

      if(!playlist) throw new NotFoundException("No playlist was found with the given id");
      if(playlist.OwnerID == userId) throw new BadRequestException("You cannot follow your own playlist");
      if(playlist.Private) throw new BadRequestException("You cannot follow private playlists (you shouldn't have access to it either *raised eyebrow*)");
    }

    const field = createFollowedDto.Type === "Playlist" ? "PlaylistID" : "TypeID";
    
    return this.db.followed.create({
      data: {
        UserID: userId,
        [field]: createFollowedDto.FollowedID,
        Type: createFollowedDto.Type
      }
    })

  }

  findAll(userId: number) {
    return this.db.followed.findMany({
      where: { UserID: userId }
    });
  }

  async remove(id: number) {
    return await this.db.followed.delete({
      where: {
        FollowedID: id
      }
    });
  }
}
