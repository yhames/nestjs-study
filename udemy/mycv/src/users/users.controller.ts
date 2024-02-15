import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password);
  }

  @UseInterceptors(ClassSerializerInterceptor) // @Exclude() 데코레이터가 적용된 프로퍼티를 제외하고 반환한다.
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Get('/:email')
  async findAllUsers(@Param('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id, 10));
  }
}
