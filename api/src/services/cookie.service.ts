// src/auth/cookie.service.ts

import { Injectable } from '@nestjs/common';
import type { Response, Request } from 'express';

@Injectable()
export class CookieService {
  setCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true, // prevent client-side JS access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  getTokenFromCookies(req: Request): string | undefined {
    const access_token = req.headers.cookie
      ?.split(';')
      .find((c) => c.startsWith('access_token='))
      ?.split('=')[1];

    return access_token;
  }

  clearCookie(res: Response) {
    res.clearCookie('access_token');
  }
}
