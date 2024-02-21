import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  /**
   * data: 데코레이터에 전달된 인자
   */
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser; // currentUser는 CurrentUserInterceptor에서 생성한다.
  },
);
