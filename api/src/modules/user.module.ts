// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';

import { JwtModule } from '@nestjs/jwt';
import { CookieService } from 'src/services/cookie.service'; // Import the CookieService
import { UserService } from 'src/services/user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserController } from 'src/controllers/user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [UserService, JwtAuthGuard, CookieService],
  controllers: [UserController],
})
export class UserModule {}
