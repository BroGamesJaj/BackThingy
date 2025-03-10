import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            global: true,
            secret: configService.get<string>('JWT_ACCESS_SECRET'),
            signOptions: { expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN')},
          })
        })
      ],
  controllers: [PlaylistsController],
  providers: [PlaylistsService, PrismaService],
})
export class PlaylistsModule {}
