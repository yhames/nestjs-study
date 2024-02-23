import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
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
  configure(consumer: MiddlewareConsumer) {
    consumer // 전역 범위에 미들웨어를 적용한다.
      .apply(
        cookieSession({
          keys: ['jeongwpa'], // using encrypt key
        }),
      )
      .forRoutes('*'); // 모든 경로에 미들웨어를 적용한다.
  }
}
