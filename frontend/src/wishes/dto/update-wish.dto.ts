import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDto } from './create-wish.dto';
import { IsUrl, Length } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  price: number;

  raised: number;

  @Length(1, 1024)
  description: string;

  copied: number;
}
