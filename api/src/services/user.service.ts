// src/user/user.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CookieService } from 'src/services/cookie.service';
import type { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private cookieService: CookieService, // Inject CookieService
  ) {}

  // Fetch the current user based on the JWT token from the cookies
  async getCurrentUser(req: Request): Promise<User> {
    const token = this.cookieService.getTokenFromCookies(req);

    if (!token) {
      throw new Error('No access token provided');
    }

    try {
      const decoded = this.jwtService.verify<TokenPayload>(token);

      const user = await this.usersRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch {
      throw new Error('Invalid or expired token');
    }
  }
}
