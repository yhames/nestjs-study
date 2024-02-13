import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    /**
     * 컨테이너에서 의존성 주입을 할 때
     * 제네릭에 대해서는 주입이 자동으로 되지 않는다.
     * 따라서 @InjectRepository() 데코레이터를 사용해서 주입해야 한다.
     */
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }
}
