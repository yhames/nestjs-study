import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel, Role } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ProfileModel } from './entity/profile.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
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
      relations: {
        profile: true,
      },
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
    });
  }

  @Post('users/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@naver.com',
    });

    await this.profileRepository.save({
      profileImg: 'asdf.jpg',
      user,
    });

    return user;
  }
}
