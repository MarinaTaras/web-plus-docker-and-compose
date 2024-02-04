import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
//На основе этой гарды мы можем сделать свою,
//достаточно лишь указать имя стратегии
