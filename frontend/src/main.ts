import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Для валидации данных от клиента в DTO добавим глобальный пайплайн валидации на следующей строке
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
