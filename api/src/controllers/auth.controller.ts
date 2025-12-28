// src/auth/auth.controller.ts

import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import type { Response } from 'express';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/services/auth.service';
import { CookieService } from 'src/services/cookie.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      repeatPassword: string;
    },
  ): Promise<User> {
    return this.authService.register(
      body.username,
      body.password,
      body.repeatPassword,
    );
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body()
    body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.username, body.password);

    this.cookieService.setCookie(res, result.access_token);

    return { message: 'Login successful' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res() res: Response) {
    this.cookieService.clearCookie(res);

    res.send({ message: 'Logged out successfully' });
  }
}
