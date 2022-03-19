import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { User as UserDecorator } from '../auth/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@UserDecorator() user: User) {
    return user;
  }

  @Patch('edit')
  editProfile(@Body() dto: EditUserDTO, @UserDecorator('id') userId: number) {
    return this.userService.editUser(userId, dto);
  }
}
