import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login() {
    return this.authService.login();
  }

  @Post('signup')
  signUp(
    @Body() body: AuthDTO,
    @Body('password', ParseIntPipe) password: number,
  ) {
    console.log('typeOfPassword', typeof password);
    return this.authService.signUp();
  }
}
