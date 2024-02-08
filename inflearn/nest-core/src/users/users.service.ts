import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    const nickNameExist = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });
    if (nickNameExist) {
      throw new BadRequestException('이미 사용중인 닉네임입니다.');
    }

    const emailExist = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });
    if (emailExist) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });
    return this.usersRepository.save(userObject);
  }

  async getAllUsers() {
    return this.usersRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
