import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDto } from './create-wishlist.dto';
import { IsUrl, IsArray, Length, IsOptional } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @Length(1, 250)
  name: string;

  @Length(1, 1500)
  @IsOptional()
  description: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsOptional()
  items: number[];
}
