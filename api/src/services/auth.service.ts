// src/auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    username: string,
    password: string,
    repeatPassword: string,
  ): Promise<User> {
    const user = new User();
    if (password !== repeatPassword) {
      throw new Error('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.username = username;
    user.password = hashedPassword;

    return await this.usersRepository.save(user);
  }

  // Login the user and generate JWT
  async login(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }

  generateJwt(user: User): string {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
