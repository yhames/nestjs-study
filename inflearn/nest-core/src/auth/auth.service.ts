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
   * @Todo hash
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
