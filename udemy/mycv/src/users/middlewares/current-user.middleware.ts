import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  /**
   * @param req 요청 객체 from express
   * @param res 응답 객체 from express
   * @param next 다음 미들웨어로 요청을 전달하는 함수
   */
  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      // eslint-disable-next-line
      // @ts-expect-error
      req.currentUser = await this.usersService.findOne(userId);
    }

    next();
  }
}
