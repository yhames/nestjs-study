import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './users.entity';

@Controller('auth')
@UseInterceptors(CurrentUserInterceptor) // @CurrentUser 데코레이터를 사용하기 위해 CurrentUserInterceptor를 사용한다.
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 세션 저장소에 색상을 저장한다.
   */
  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  /**
   * 세션 저장소에서 색상을 가져온다.
   */
  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Get('whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Serialize(ResponseUserDto) // SerializeInterceptor를 사용하여 Response 객체를 변환한다.
  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signUp(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signIn(body.email, body.password);
    /**
     * `/signUp` 이후에 바로 `/signIn`을 호출하면, 응답 헤더에 `Set-Cookie`가 포함되어 있지 않다.
     * 이는 session 객체가 변경되지 않았기 때문이다. session 객체를 변경할 때에만 응답 헤더에 `Set-Cookie`가 포함된다.
     */
    session.userId = user.id;
    return user;
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
  @Get()
  async findAllUsers(@Body('email') email: string) {
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
