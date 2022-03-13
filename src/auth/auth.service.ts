import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(dto: AuthDTO) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Login credential is incorrect');
    }

    const isPasswordMatched = await argon.verify(user.hash, dto.password);

    if (!isPasswordMatched) {
      throw new ForbiddenException('Login credential is incorrect');
    }

    return {
      jwt: await this.signJwt(user.id, user.email),
    };
  }

  async signUp(dto: AuthDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          firstName: true,
          lastName: true,
        },
      });

      return {
        jwt: await this.signJwt(user.id, user.email),
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // "Unique constraint failed on the {constraint}"
        throw new ForbiddenException('User already exists');
      }

      throw error;
    }
  }

  signJwt(userId: number, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SIGNING_SECRET'),
      expiresIn: '60m',
    });
  }
}
