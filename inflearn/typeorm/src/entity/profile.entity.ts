import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserModel, (user) => user.profile)
  @JoinColumn() // profile 테이블에 user_id 컬럼이 생긴다.
  user: UserModel;

  @Column()
  profileImg: string;
}
