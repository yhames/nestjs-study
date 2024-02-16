import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    // ValidationPipe()를 주입하지 않아도 class-validator가 전역적으로 적용된다.
    new ValidationPipe({
      transform: true, // 값이 없는 경우 default value로 변환하는 옵션
      transformOptions: {
        enableImplicitConversion: true, // string -> number, boolean 등으로 자동 변환하는 옵션
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
