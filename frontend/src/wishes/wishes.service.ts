import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User) {
    const wish = { ...createWishDto, owner };
    await this.wishRepository.save(wish);
    return { ok: true, status: 'success' };
  }

  async findAll(): Promise<Wish[]> {
    return await this.wishRepository.find();
  }

  async findOne(id: number): Promise<Wish> {
    return await this.wishRepository.findOne({
      relations: { owner: true, offers: { user: true } },
      where: { id },
    });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish[]> {
    const wish = await this.wishRepository.findOne({
      relations: { owner: true, offers: true },
      where: { id },
    });

    if (!wish) {
      throw new NotFoundException('Не найден');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'нельзя изменять или удалять чужие «хотелки», а также изменять стоимость, если уже есть желающие скинуться.',
      );
    }
    if (wish?.owner?.id !== userId || wish.offers.length) {
      throw new BadRequestException(
        'нельзя изменять или удалять чужие «хотелки»',
      );
    }
    try {
      await this.wishRepository.update(id, updateWishDto);
      return await this.wishRepository.findBy({ id });
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne(id);
    if (!wish) {
      throw new NotFoundException('Не найден');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'нельзя изменять или удалять чужие «хотелки»',
      );
    }
    return await this.wishRepository.delete(id);
  }

  //для списка подарков
  async findWishList(item): Promise<Wish[]> {
    return await this.wishRepository.findBy(item);
  }

  async copyWish(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });
    const copied = (await this.wishRepository.findOne({
      where: { owner: { id: user.id }, name: wish.name },
    }))
      ? true
      : false;
    if (copied)
      throw new ConflictException('Нельзя повторно копировать "хотелку"');
    wish.owner = user;
    delete wish.id;
    return await this.wishRepository.save(wish);
  }

  //последние 40
  async fortyWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  //20 которые чаще всего сохраняют
  async topTwentyWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  //если нужен поиск по какому-то параметру
  async findMany(key: string, param: any): Promise<Wish[]> {
    return await this.wishRepository.findBy({
      [key]: param,
    });
  }
}
