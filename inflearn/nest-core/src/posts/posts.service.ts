import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from '../common/common.service';
import { basename, join } from 'path';
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from '../common/const/path.const';
import { promises } from 'fs';
import { ImageModel } from '../common/entity/image.entity';
import { CreatePostImageDto } from './image/dto/create-image.dto';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    private readonly commonService: CommonService,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
    });
  }

  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      DEFAULT_POST_FIND_OPTIONS,
      'posts',
    );
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(authorId: number, createPostDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...createPostDto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });
    return this.postsRepository.save(post);
  }

  async createPostImage(dto: CreatePostImageDto) {
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath); // 파일이 존재하지 않으면 에러가 발생한다.
    } catch (e) {
      throw new NotFoundException('파일이 존재하지 않습니다.');
    }

    // 파일 이름을 추출한다. (ex: /public/temp/{uuid}.jpg -> {uuid}.jpg)
    const fileName = basename(tempFilePath);

    // 이동할 경로를 생성한다.  (ex: /public/posts/{uuid}.jpg)
    const newPath = join(POST_IMAGE_PATH, fileName);

    // save
    const result = await this.imageRepository.save({
      ...dto,
    });

    // 파일을 이동한다.
    await promises.rename(tempFilePath, newPath);

    return result;
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    return this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return this.postsRepository.remove(post);
  }
}
