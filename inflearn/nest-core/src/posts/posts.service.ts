import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsModel } from './entities/posts.entity';
import { MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  /**
   * data: Data[],
   * cursor: {
   *   after: 마지막 Data의 id,
   * },
   * count: 응답한 데이터의 개수,
   * next: 다음 요청시 사용할 URL
   *
   * 1. 오름차순 정렬하는 Pagination을 구현한다.
   */
  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postsRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createAt,
      },
      take: dto.take,
    });
    return { data: posts };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
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
      likeCount: 0,
      commentCount: 0,
    });
    return this.postsRepository.save(post);
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
