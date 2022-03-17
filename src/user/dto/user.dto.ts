import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
