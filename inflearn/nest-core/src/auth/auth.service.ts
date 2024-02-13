import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from '../users/entities/users.entity';
import { HASH_ROUNDS, JWT_SECRET } from './const/auth.const';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * 토큰을 사용하는 방식
   * 1. 사용자가 로그인 또는 회원가입을 진행하면 access token과 refresh token을 발급 받는다.
   * 2. 로그인할 때는 **Basic 토큰**과 함께 요청을 보낸다. (Basic 토큰: '이메일:비밀번호'를 base64로 인코딩한 값)
   *    - {Authorization: `Basic ${token}`}
   * 3. 아무나 접근할 수 없는 정보(private route)에 접근할 때는 **accessToken**을 Header에 추가해서 함께 요청한다.
   *    - {Authorization: `Bearer ${token}`}
   * 4. 토큰과 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   * 5. 토큰이 만료되면 refreshToken을 사용해서 새로운 토큰을 발급 받는다. (그렇지 않으면 `jwtService.verify()`에서 에러가 발생한다)
   *    따라서 accessToken을 새로 발급받는 /auth/token/access 기능과
   *    refreshToken을 새로 발급받는 /auth/token/refresh 기능이 필요하다.
   * 6. 토큰이 만료되면 각각의 토큰을 재발급 받는 엔트포인트를 통해 새로운 토큰을 발급 받고
   *    새로운 토큰을 사용해서 private route에 접근한다.
   */

  /**
   * Header로 받는 토큰
   * 1. Authorization: `Basic ${token}`
   * 2. Authorization: `Bearer ${accessToken}`
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');
    const prefix = isBearer ? 'Bearer' : 'Basic';
    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    return splitToken[1];
  }

  /**
   * Basic 토큰을 디코딩하는 로직
   * 1. YWRtaW5AZ21haWwuY29tOmFkbWlu -> email:password
   * 2. email:password -> [email, password]
   * 3. [email, password] -> {email: email, password: password}
   */
  decodeBasicToken(base64String: string) {
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');
    const split = decoded.split(':');
    if (split.length !== 2) {
      throw new UnauthorizedException('토큰이 올바르지 않습니다.');
    }
    return { email: split[0], password: split[1] };
  }

  /**
   * 토큰 검증
   */
  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('토큰이 만료되었습니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token, {
      secret: JWT_SECRET,
    });
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refreshToken으로만 가능합니다.',
      );
    }
    return this.signToken({ ...decoded }, isRefreshToken);
  }

  /**
   * 기능
   * 1. registerWithEmail
   *    - email, nickname, password를 입력받고 사용자 생성
   *    - 생성 후 access token과 refresh token을 반환 -> 회원가입 후 다시 로그인 방지
   *
   * 2. loginWithEmail
   *    - email, password를 입력받고 사용자 인증
   *    - 검증이 완료되면 access token과 refresh token을 반환
   *
   * 3. loginUser
   *    - 1, 2번에서 필요한 access token과 refresh token을 반환하는 로직
   *
   * 4. signToken
   *    - 3번에서 필요한 access token과 refresh token을 발급하는 로직
   *
   * 5. authenticateWithEmailAndPassword
   *    - 2번에서 로그인을 진행할 때 필요한 기본적인 검증 진행
   *      1) email이 존재하는지
   *      2) password가 일치하는지
   *      3) 검증이 완료되면 사용자 정보 반환
   *         3-1) loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * 회원가입
   */
  async registerWithEmail(
    user: Pick<UsersModel, 'email' | 'nickname' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);
    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });
    return this.loginUser(newUser);
  }

  /**
   * 로그인
   */
  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const userObject = await this.authenticateWithEmailAndPassword(user);

    return this.loginUser(userObject);
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: isRefreshToken ? 3600 : 300,
    });
  }

  async authenticateWithEmailAndPassword(
    user: Pick<UsersModel, 'email' | 'password'>,
  ) {
    const existingUser = await this.usersService.getUserByEmail(user.email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // bcrypt.compare(비밀번호, 해시된 비밀번호);
    const passOk = await bcrypt.compare(user.password, existingUser.password);
    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }
}
