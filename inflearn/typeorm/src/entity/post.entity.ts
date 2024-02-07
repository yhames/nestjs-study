import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';
import { TagModel } from './tag.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // OneToOne과 다르게 ManyToOne에서는 Many쪽에 외래키가 생성된다.
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @Column()
  title: string;

  @ManyToMany(() => TagModel, (tag) => tag.posts)
  @JoinTable() // 다대다 관계를 매핑하는 post_tags 중간 테이블을 생성한다.
  tags: TagModel[];
}
