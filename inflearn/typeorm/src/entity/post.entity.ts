import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  // OneToOne과 다르게 ManyToOne에서는 Many쪽에 외래키가 생성된다.
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @Column()
  title: string;
}
