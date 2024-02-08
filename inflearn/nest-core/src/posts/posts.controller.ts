import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  async getPost(@Param('id') id: string) {
    return this.postsService.getPostById(+id);
  }

  @Post()
  async createPost(
    @Body('authorId') authorId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(authorId, title, content);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(+id, title, content);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
