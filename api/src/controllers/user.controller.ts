// src/user/user.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Route to get the current authenticated user
  @Get('me')
  @UseGuards(JwtAuthGuard) // Protect this route with the JWT Guard
  async getCurrentUser(@Req() req: Request) {
    const user = await this.userService.getCurrentUser(req);
    return user;
  }
}
