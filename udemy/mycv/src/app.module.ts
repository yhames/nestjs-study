import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dbConfig = require('../ormconfig');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE, // 전역 범위의 파이프를 주입하여 사용할 수 있다.
      useValue: new ValidationPipe({
        whitelist: true, // 유효성 검사를 하지 않는 프로퍼티를 삭제
      }),
    },
  ],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer // 전역 범위에 미들웨어를 적용한다.
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')], // using encrypt key
        }),
      )
      .forRoutes('*'); // 모든 경로에 미들웨어를 적용한다.
  }
}
