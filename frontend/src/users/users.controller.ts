import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @Post('find')
  findUsers(@Body('query') query: string) {
    return this.usersService.findMany(query);
  }

  @Get('me')
  async viewMy(@Req() req): Promise<User> {
    return await this.usersService.findOne(req.user.id);
  }

  @Patch('me')
  async update(@Req() req, @Body() updateUsertDto: UpdateUserDto) {
    await this.usersService.update(req.user.id, updateUsertDto);
  }

  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    const users = await this.usersService.findWishes(req.user.id);
    const wishes = users.map((user) => user.wishes);
    return wishes[0];
  }

  @Get(':username')
  async findByUserName(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findUserByName(username);
    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.wishesService.findMany('owner', { username });
  }
}
