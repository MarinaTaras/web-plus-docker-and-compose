import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsBoolean } from 'class-validator';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  item: number;

  amount: number;

  @IsBoolean()
  hidden: boolean;
}
