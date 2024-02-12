import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

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
  async createPost(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('isPublic', new DefaultValuePipe(true)) isPublic: boolean,
  ) {
    return this.postsService.createPost(authorId, title, content);
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
