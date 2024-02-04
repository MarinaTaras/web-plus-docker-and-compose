import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const { items } = createWishlistDto;
    const wishes = items.map((id) => {
      return this.wishesService.findOne(id);
    });

    return await Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistsRepository.create({
        ...createWishlistDto,
        owner: owner,
        items,
      });
      return this.wishlistsRepository.save(wishlist);
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
    if (!wishlist) {
      throw new BadRequestException('Не найден список "хотелок"');
    }
    return wishlist;
  }

  async updateOne(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    user: User,
  ): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
    let items;
    if (updateWishlistDto.items) {
      items = await this.wishesService.findWishList(
        updateWishlistDto.items as number[],
      );
    }
    if (user.id !== wishlist?.owner?.id) {
      throw new BadRequestException('нельзя изменять чужие «хотелки»');
    }
    await this.wishlistsRepository.save({
      id: wishlist.id,
      items: items ? items : wishlist.items,
      name: updateWishlistDto.name ? updateWishlistDto.name : wishlist?.name,
      image: updateWishlistDto.image
        ? updateWishlistDto.image
        : wishlist?.image,
      owner: wishlist.owner,
    });
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });
  }

  async remove(id: number, user: User): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException('нельзя удалять чужие «хотелки»');
    }
    return await this.wishlistsRepository.remove(wishlist);
  }
}
