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
    /**
     * create() 메서드로 새로운 Entity 인스턴스를 생성하지 않으면
     * TypeORM Hooks와 같은 기능을 사용할 수 없다.
     * 마찬가지로 insert(), update() 혹은 delete() 메서드를 사용하면 TypeORM Hooks를 사용할 수 없다.
     */
    return this.usersRepository.save(user);
  }
}
