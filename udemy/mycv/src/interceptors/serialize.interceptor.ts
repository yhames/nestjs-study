import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export function Serialize(responseDto: any) {
  return UseInterceptors(new SerializeInterceptor(responseDto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly responseDto: any) {}

  // CallHandler는 RxJS의 Observable을 상속받는다.
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler
    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        return plainToInstance(this.responseDto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
