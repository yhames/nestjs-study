import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';

/**
 * data: 사용자가 전달한 데이터 (예: @User('userId')에서 'userId')
 * context: ExecutionContext (bearer-token.guard.ts에서 사용한 것과 동일)
 */
export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    const user = req.user as UsersModel;
    if (!user) {
      throw new InternalServerErrorException(
        'Request에 user가 존재하지 않습니다.',
      );
    }
    if (data) {
      return user[data]; // keyof UsersModel로 타입을 제한했기 때문에 data가 UsersModel의 key 중 하나임이 보장된다.
    }
    return user;
  },
);
