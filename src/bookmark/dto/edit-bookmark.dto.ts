import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditBookmarkDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
