import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

/**
 * Basic Token 구현할 기능
 * 1. 요청을 불러오고 authorization header로부터 토큰을 가져온다.
 * 2. authService.extractTokenFromHeader를 사용해서 사용 가능한 형태의 토큰을 추출한다.
 * 3. authService.decodeBasicToken을 사용해서 email과 password를 추출한다.
 * 4. email과 password를 사용해서 사용자를 찾는다. (authenticateWithEmailAndPassword)
 * 5. 찾은 사용자를 1번의 요청에 저장한다.
 */

// CanActivate를 상속받아서 canActivate 메서드를 구현한다.
@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  // true를 반환하면 요청을 통과시키고 false를 반환하면 요청을 막는다.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ExecutionContext를 사용해서 요청(request)을 가져온다.
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 필요합니다.');
    }
    const token = this.authService.extractTokenFromHeader(rawToken, false);
    const credentials = this.authService.decodeBasicToken(token);
    req.user =
      await this.authService.authenticateWithEmailAndPassword(credentials);
    return true;
  }
}
