import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
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
import { DataSource } from 'typeorm';
import { PostsImagesService } from './image/images.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsImagesService: PostsImagesService,
    private readonly dataSource: DataSource,
  ) {}

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
    /**
     * Transaction
     * connect -> DataSource 연결
     * startTransaction -> 쿼리 시작
     * commit | rollback -> 저장 | 복구
     * release -> 연결 해제
     */
    // 트랜잭션을 담당할 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리 러너를 연결한다.
    await qr.connect();

    // 트랜잭션을 시작한다.
    // 이 시점부터 `qr`을 통해 실행되는 모든 쿼리는 하나의 트랜잭션으로 묶인다. (`qr`을 사용하지 않으면 트랜잭션이 적용되지 않는다.)
    await qr.startTransaction();

    // 로직 실행, try-catch로 에러 처리
    try {
      const post = await this.postsService.createPost(userId, body, qr);
      for (let i = 0; i < body.images.length; i++) {
        await this.postsImagesService.createPostImage(
          {
            post,
            order: i,
            path: body.images[i],
            type: ImageModelType.POST_IMAGE,
          },
          qr,
        );
      }
      await qr.commitTransaction(); // 트랜잭션을 커밋한다.
      await qr.release(); // 쿼리 러너를 해제한다.
      return this.postsService.getPostById(post.id);
    } catch (e) {
      // 에러가 발생하면 트랜잭션을 롤백한다.
      await qr.rollbackTransaction();
      await qr.release(); // 쿼리 러너를 해제한다.
      throw new InternalServerErrorException(
        '게시글을 생성하는 중에 에러가 발생했습니다.',
      );
    }
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
