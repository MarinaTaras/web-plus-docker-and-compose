import { Injectable, BadRequestException } from '@nestjs/common';
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
    if (
      +item.raised + createOfferDto.amount > item.price ||
      item.owner.id === user.id
    ) {
      throw new BadRequestException('Ошибка!');
    }
    const { id } = await this.offerRepository.save({
      user,
      item,
      ...createOfferDto,
    });

    return await this.offerRepository.findBy({ id });
  }

  async findAll() {
    return await this.offerRepository.find();
  }

  async findOne(id: number) {
    return await this.offerRepository.findBy({ id });
  }
}
