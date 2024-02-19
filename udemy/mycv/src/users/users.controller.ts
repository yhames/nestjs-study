import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  /**
   * `@UseInterceptors(ClassSerializerInterceptor)` 데코레이터를 사용하여
   * Entity의 `@Exclude()` 데코레이터가 붙은 프로퍼티를 숨기면,
   * 서로 다른 요청에 대해 Response 객체를 다르게 반환할 수 없다.
   * 따라서 `@UseInterceptors(SerializeInterceptor)`와 같이 커스텀 데코레이터를 사용해야 한다.
   */
  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Get('/:email')
  async findAllUsers(@Param('email') email: string) {
    return this.usersService.find(email);
  }

  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }

  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }
}
