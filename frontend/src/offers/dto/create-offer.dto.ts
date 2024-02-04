import { IsBoolean } from 'class-validator';

export class CreateOfferDto {
  id: number;

  amount: number;

  @IsBoolean()
  hidden: boolean;
}
