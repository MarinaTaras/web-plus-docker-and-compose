import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get()
  async getAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: number,
    @Req() req,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateOne(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req): Promise<Wishlist> {
    return this.wishlistsService.remove(id, req.user);
  }
}
