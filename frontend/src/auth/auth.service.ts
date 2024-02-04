import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { secret: 'jwt_secret' }),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findUserByName(username);

    /* В идеальном случае пароль обязательно должен быть захэширован */

    const equal = this.usersService.validateHash(password, user.password);

    if (user && equal) {
      /* Исключаем пароль из результата */
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
