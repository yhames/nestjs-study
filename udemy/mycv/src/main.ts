import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['jeongwpa'], // using encrypt key
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 유효성 검사를 하지 않는 프로퍼티를 삭제
    }),
  );
  await app.listen(3000);
}

bootstrap();
