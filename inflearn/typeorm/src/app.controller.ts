import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel, Role } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('users')
  async createUser() {
    return this.userRepository.save({
      role: Role.USER,
    });
  }

  @Get('users')
  async getUsers() {
    return this.userRepository.find({
      // 어떤 프로퍼티를 가져올지
      // 지정하지 않으면 기본적으로 모든 프로퍼티를 가져온다.
      // 지정하면 지정된 프로퍼티만 가져온다. (eager: true로 설정하면 기본적으로 가져온다.)
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        version: true,
        profile: {
          id: true,
        },
      },
      // 필터링할 조건 설정, && 조건으로 설정된다.
      // || 조건으로 설정하려면 리스트로 설정해야 한다.
      where: [
        {
          profile: {
            id: 4,
          },
        },
        {
          version: 1,
        },
      ],

      // 관계 가져오는 설정 (eager: true로 설정하면 기본적으로 가져온다.)
      // select나 where와 같이 사용할 수 있다.
      relations: {
        profile: true,
      },
      // 정렬 설정
      // id: 'ASC' 또는 id: 'DESC'로 설정할 수 있다.
      order: {
        id: 'ASC',
      },
      // 건너뛸 데이터의 개수 설정
      skip: 0,
      // 가져올 데이터의 개수 설정
      take: 10,
    });
  }

  @Patch('users/:id')
  async updateUser(@Param('id') id: string): Promise<UserModel> {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id, 10),
      },
    });

    return this.userRepository.save({
      ...user,
      email: user.email + '0',
    });
  }

  @Post('users/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@naver.com',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // await this.profileRepository.save({
    //   user,
    //   profileImg: 'asdf.jpg',
    // });

    return user;
  }

  @Delete('users/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete({
      id: parseInt(id, 10),
    });
  }

  @Post('users/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: 'postUser@naver.com',
    });

    await this.postRepository.save({
      title: "I'm a post No.1!",
      author: user,
    });

    await this.postRepository.save({
      title: "I'm a post No.2!",
      author: user,
    });

    await this.postRepository.save({
      title: "I'm a post No.3!",
      author: user,
    });

    return user;
  }

  @Get('posts')
  async getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  async getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  @Post('posts/tags')
  async createPostAndTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });

    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });

    return true;
  }
}
