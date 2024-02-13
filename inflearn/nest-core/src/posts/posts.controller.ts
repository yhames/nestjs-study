import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { UsersModel } from '../users/entities/users.entity';
import { User } from '../users/decorator/users.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  /**
   * `ParseIntPipe`는 `Nest Container`에서 `Inject`하는 반면,
   * `DefaultValuePipe`는 직접 객체를 생성해서 사용한다.
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  async createPost(
    @User('id') userId: number, // `AccessTokenGuard`을 통해 `request`에 저장된 `user`를 가져온다.
    @Body('title')
    title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(userId, title, content);
  }

  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(id, title, content);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
