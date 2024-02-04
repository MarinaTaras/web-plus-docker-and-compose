import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  validateHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto?.password);
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findMany(query: string) {
    const manyUsers = await this.userRepository.find({
      where: [{ email: Like(`%${query}%`) }, { username: Like(`%${query}%`) }],
    });
    return manyUsers;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.findOne(id);
    if (updateUserDto.username !== (await user).email) {
      const username = await this.findMany(updateUserDto.username);

      if (username) {
        throw new BadRequestException('Такое имя пользователя существует');
      }
    }

    if (updateUserDto.email !== (await user).email) {
      const useremail = await this.findMany(updateUserDto.email);

      if (useremail) {
        throw new BadRequestException('Существует пользователь с таким email');
      }
    }
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findWishes(id: number): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: { wishes: true },
      where: { id },
    });
    return users;
  }
}
