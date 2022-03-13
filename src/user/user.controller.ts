import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { User as UserDecorator } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@UserDecorator() user: User) {
    return user;
  }
}
