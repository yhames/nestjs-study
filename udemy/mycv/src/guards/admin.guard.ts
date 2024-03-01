import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUserInterceptor에서 currentUser를 설정하지 않은 경우 false를 반환하여 요청을 막는다.
 * 하지만 Guard는 Interceptor 이전에 실행되므로 currentUser가 항상 설정되어 있지 않다.
 * 따라서 CurrentUserInterceptor를 CurrentUserMiddleware로 변경해야한다.
 */
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
