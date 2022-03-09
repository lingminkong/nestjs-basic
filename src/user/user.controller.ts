import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { User as UserDecorator } from 'src/auth/decorator/user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@UserDecorator() user: User) {
    return user;
  }
}
