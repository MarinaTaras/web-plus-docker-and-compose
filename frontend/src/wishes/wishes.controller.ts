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
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Wish } from './entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  getLastForty() {
    return this.wishesService.fortyWishes();
  }

  @Get('top')
  getTop() {
    return this.wishesService.topTwentyWishes();
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.wishesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ): Promise<Wish[]> {
    return this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() req) {
    return this.wishesService.remove(id, req.user.id);
  }

  @Post(':id/copy')
  async copy(@Param('id') id: number, @Req() req): Promise<Wish> {
    return this.wishesService.copyWish(id, req.user);
  }
}
