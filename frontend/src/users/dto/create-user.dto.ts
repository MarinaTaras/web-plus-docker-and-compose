import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @IsOptional()
  @Length(2, 200)
  about?: string;

  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
