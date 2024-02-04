import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
