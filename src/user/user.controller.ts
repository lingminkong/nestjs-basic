import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { User as UserDecorator } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { UserDTO } from './dto/user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@UserDecorator() user: User) {
    return user;
  }

  @Post('edit')
  editProfile(@Body() dto: any, @UserDecorator() user: User) {
    console.log('dto:', dto);
    console.log('user:', user);
    return dto;
  }
}
