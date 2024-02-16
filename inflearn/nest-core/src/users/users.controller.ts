import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.usersService.createUser({ nickname, email, password });
  }

  /**
   * @serialization : 현재 사용되는 데이터의 포멧를 다른 시스템에서 사용할 수 있는 포멧으로 변환하는 것
   *                 (ex. class의 object -> json)
   * @deserialization : 다른 시스템에서 사용하는 데이터의 포멧을 현재 시스템에서 사용하는 포멧으로 변환하는 것
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor) // @Exclude() 데코레이터가 붙은 필드를 숨긴다.
  async getUsers() {
    return this.usersService.getAllUsers();
  }
}
