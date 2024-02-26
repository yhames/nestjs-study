import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();
    req.queryRunner = qr; // 쿼리 러너를 `request`에 저장한다.

    return next.handle().pipe(
      catchError(async (err) => {
        await qr.rollbackTransaction();
        await qr.release();
        throw new InternalServerErrorException(err.message);
      }),
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
