import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsString } from 'class-validator';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { Transform } from 'class-transformer';
import { join } from 'path';
import { POST_PUBLIC_IMAGE_PATH } from '../../common/const/path.const';
import { ImageModel } from '../../common/entity/image.entity';

@Entity()
export class PostsModel extends BaseModel {
  /**
   * 1. FK를 이용해서 UsersModel과 연동한다.
   * 2. null이면 안된다.
   */
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  title: string;

  @Column()
  @IsString({
    message: stringValidationMessage,
  })
  content: string;

  @OneToMany(() => ImageModel, (image) => image.post)
  images: string[];

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
