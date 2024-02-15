import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from '../users/dto/response-user.dto';

export class SerializeInterceptor implements NestInterceptor {
  // CallHandler는 RxJS의 Observable을 상속받는다.
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler
    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        return plainToInstance(ResponseUserDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
