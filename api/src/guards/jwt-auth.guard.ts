// src/auth/jwt-auth.guard.ts

import { Injectable } from '@nestjs/common';
import { ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CookieService } from 'src/services/cookie.service'; // Import CookieService
import { Observable } from 'rxjs';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private cookieService: CookieService, // Inject CookieService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request & { user: TokenPayload } = context
      .switchToHttp()
      .getRequest();
    const token = this.cookieService.getTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }

    try {
      const decoded = this.jwtService.verify<TokenPayload>(token);

      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
