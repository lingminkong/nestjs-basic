import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return "I've logged in";
  }

  signUp(dto: AuthDTO) {
    console.log('dto in auth service: ', dto);
    return "I've signed up";
  }
}
