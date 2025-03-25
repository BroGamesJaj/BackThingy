import { Module } from '@nestjs/common';
import { FollowedService } from './followed.service';
import { FollowedController } from './followed.controller';
import { PrismaService } from '../prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
  controllers: [FollowedController],
  providers: [FollowedService, PrismaService],
})
export class FollowedModule {}
