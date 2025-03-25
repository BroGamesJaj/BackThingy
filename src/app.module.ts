import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { SearchModule } from './search/search.module';
import { FollowedModule } from './followed/followed.module';

@Module({
  imports: [UsersModule, AuthModule, PlaylistsModule, SearchModule, FollowedModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
