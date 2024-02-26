import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    /**
     * 요청이 들어올 때 REQ 요청이 들어온 타임스탬프를 찍는다.
     * [REQ] {요청 path} {요청 시간}
     */
    const now = new Date();
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);
    // next.handle()은 Observable을 반환한다.
    /**
     * pipe()의 인자로 `OperatorFunction`을 넘겨주면 함수들이 파이프라인으로 연결되어 순차적으로 실행된다.
     * @see https://rxjs.dev/api/index/function/pipe
     */
    return next
      .handle()
      .pipe(
        tap((observable) =>
          console.log(
            `[RES] ${path} ${now.toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
          ),
        ),
      );
  }
}
