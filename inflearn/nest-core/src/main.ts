import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // ValidationPipe()를 주입하지 않아도 class-validator가 전역적으로 적용된다.
  await app.listen(3000);
}
bootstrap();
