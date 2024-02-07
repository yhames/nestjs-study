import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { ProfileModel } from './profile.entity';
import { PostModel } from './post.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class UserModel {
  // @PrimaryGeneratedColumn() : auto-increment
  // @PrimaryGeneratedColumn('uuid') : uuid
  // @PrimaryColumn() : custom primary key
  @PrimaryGeneratedColumn()
  id: number;

  /*
  @Column({
    // DB에서 인지하는 칼럼 타입, 자동으로 유추됨.
    type: 'varchar',
    // DB의 칼럼의 이름, 프로퍼티 이름으로 유추됨.
    name: 'title',
    // 값의 길이, 일반적으로 varchar와 함께 사용됨.
    length: 100,
    // 값이 null일 수 있는지 여부
    nullable: false,
    // false면 처음 젖아할때만 값 지정 가능, 그 후에는 변경 불가
    update: false,
    // find()를 실행할 떄 기본으로 값을 불러올지, 기본값이 true
    select: true,
    // 값이 없을 경우 기본값을 지정
    default: 'default title',
    // 값이 유니크한지 여부 (중복값 허용 여부)
    unique: false,
  })
  title: string;
  */
  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  // @CreateDateColumn() : 데이터가 생성되는 날짜와 시간이 자동으로 저장된다.
  @CreateDateColumn()
  createdAt: Date;

  // @UpdateDateColumn() : 데이터가 업데이트되는 날짜와 시간이 자동으로 저장된다.
  @UpdateDateColumn()
  updatedAt: Date;

  // @VersionColumn() : 데이터가 업데이트될 때마다 1씩 증가하여 버전을 관리한다.
  @VersionColumn()
  version: number;

  // @Column() + @Generated('increment') : 데이터가 생성될 때마다 1씩 증가하여 값을 저장한다.
  // @Column() + @Generated('uuid') : uuid를 생성하여 값을 저장한다.
  @Column()
  @Generated('uuid')
  additionalId: number;

  @OneToOne(() => ProfileModel, (profile) => profile.user)
  profile: ProfileModel;

  @OneToMany(() => PostModel, (post) => post.author)
  posts: PostModel[];
}
