import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBookmarkDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUrl()
  link: string;

  @IsString()
  @IsOptional()
  description?: string;
}
