import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {}; // session이 없는 경우 undefined를 참조하게 되면 에러가 발생하므로 {}로 기본값을 설정한다.
    if (userId) {
      request.currentUser = await this.usersService.findOne(userId);
    }

    return next.handle();
  }
}
