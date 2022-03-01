import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return "I've logged in";
  }

  async signUp(dto: AuthDTO) {
    console.log('dto in auth service: ', dto);
    const hash = await argon.hash(dto.password);

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

    return user;
  }
}
