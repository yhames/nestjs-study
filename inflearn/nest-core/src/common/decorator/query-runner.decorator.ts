import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        'QueryRunner를 사용하기 위해서는 TransactionInterceptor를 사용해야 합니다.',
      );
    }
    return req.queryRunner;
  },
);
