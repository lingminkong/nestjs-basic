import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDTO } from './dto/EditUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(id: number, dto: EditUserDTO) {
    console.log('user', dto);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    delete user.hash;

    return user;
  }
}
