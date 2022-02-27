import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  login() {
    return "I've logged in";
  }

  signUp() {
    return "I've signed up";
  }
}
