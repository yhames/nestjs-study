import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * data: 사용자가 전달한 데이터 (예: @User('userId')에서 'userId')
 * context: ExecutionContext (bearer-token.guard.ts에서 사용한 것과 동일)
 */
export const User = createParamDecorator((data, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();
  const user = req.user;
  if (!user) {
    throw new InternalServerErrorException(
      'Request에 user가 존재하지 않습니다.',
    );
  }
  return user;
});
