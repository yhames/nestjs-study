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
      whitelist: true, // 데코레이터가 없는 속성은 제거하는 옵션
      forbidNonWhitelisted: true, // 데코레이터가 없는 속성이 있는 경우 요청을 막는 옵션 (예외처리) (whitelist가 true일 때만 작동)
    }),
  );
  await app.listen(3000);
}
bootstrap();
