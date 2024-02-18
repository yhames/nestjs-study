import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from '../auth/guard/bearer-token.guard';
import { User } from '../users/decorator/users.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { ImageModelType } from '../common/entity/image.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
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
  async postPosts(
    @User('id') userId: number, // `AccessTokenGuard`을 통해 `request`에 저장된 `user`를 가져온다.
    @Body() body: CreatePostDto,
  ) {
    const post = await this.postsService.createPost(userId, body);
    for (let i = 0; i < body.images.length; i++) {
      await this.postsService.createPostImage({
        post,
        order: i,
        path: body.images[i],
        type: ImageModelType.POST_IMAGE,
      });
    }
    return this.postsService.getPostById(post.id);
  }

  /**
   * PUT   : 객체 전체를 교체한다.
   * PATCH : 객체의 일부를 변경한다.
   */
  @Patch(':id')
  async patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, body);
  }

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
