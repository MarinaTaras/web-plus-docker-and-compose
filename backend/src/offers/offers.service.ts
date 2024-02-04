import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const item = await this.wishesService.findOne(createOfferDto.id);
    const newRaised = Number(item.raised) + Number(createOfferDto.amount);

    if (!item) {
      throw new NotFoundException('Подарок не найден');
    }
    if (item.owner.id === user.id) {
      throw new ForbiddenException(
        'Вы не можете вносить деньги на собственные подарки',
      );
    }
    if (+item.raised + createOfferDto.amount > item.price) {
      throw new ForbiddenException(
        `Сумма взноса превышает сумму остатка стоимости подарка: ` +
          `${item.price - item.raised}` +
          `руб.`,
      );
    }

    const { id } = await this.offerRepository.save({
      user,
      item,
      ...createOfferDto,
    });

    //логики по внесению изменений в wish, где raised: raised + amount

    await this.wishesService.updateRaised(item.id, newRaised);

    return await this.offerRepository.findBy({ id });
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: number) {
    return await this.offerRepository.findBy({ id });
  }
}
