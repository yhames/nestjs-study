import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findOne(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async find(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  /**
   * Partial<>은 TypeScript에서 제공하는 타입 헬퍼이다.
   * Partial<User>를 사용하면 User Entity의 프로퍼티 중 일부만 정의할 수 있다.
   */
  async update(id: number, attrs: Partial<User>) {
    /**
     * update() 메서드는 Entity를 사용하지 않고 데이터베이스에 직접 쿼리를 보낸다.
     * 반면에 save() 메서드는 Entity를 사용하여 데이터베이스에 쿼리를 보낸다.
     * 따라서 update() 메서드를 사용하면 TypeORM Hooks를 사용할 수 없다.
     */
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      /**
       * NotFoundException 클래스는 @nestjs/common 패키지에서 제공하는 예외 클래스이다.
       * 이 클래스는 HttpException 클래스를 상속받아서 구현되어 있다.
       * 즉, NotFoundException는 Http에 대한 의존성이 있다.
       * 따라서 WebSocket이나 GRPC 같은 다른 프로토콜을 사용하는 경우에는
       * 커스텀 예외 필터를 구현해서 NotFoundException를 처리해야 한다.
       */
      throw new NotFoundException();
    }
    Object.assign(user, attrs); // user 객체에 attrs 객체의 프로퍼티를 병합한다.
    /**
     * save() 메서드는 Entity 객체를 사용해야하므로
     * findOne() 메서드를 사용하여 데이터베이스에 쿼리를 보내야한다.
     * 따라서 TypeORM Hooks를 사용하지 않는 경우에는 update() 메서드를 사용하는 것이 성능 상 이점이 있다.
     */
    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    /**
     * remove() 메서드 또한 save() 메서드와 마찬가지로
     * findOne() 메서드를 사용하여 데이터베이스에 쿼리를 보내기 때문에
     * TypeORM Hooks를 사용하지 않는 경우에는 delete() 메서드를 사용하는 것이 성능 상 이점이 있다.
     */
    return this.usersRepository.remove(user);
  }
}
