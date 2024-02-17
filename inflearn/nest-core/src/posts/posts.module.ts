import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import multer from 'multer';
import { POST_IMAGE_PATH } from '../common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsModel]),
    AuthModule,
    UsersModule,
    CommonModule,
    /**
     * limits : 파일 사이즈 제한
     * fileFilter : 파일 필터링 (에러처리)
     * storage : 파일 저장 위치 및 파일명 설정
     */
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB, 단위는 byte
      },
      fileFilter: (req, file, callback) => {
        /**
         * callback(err, boolean)
         *  - err: 에러가 발생할 경우 에러 정보를 넣는다. (없으면 null)
         *  - boolean: true면 파일을 받고, false면 파일을 받지 않는다.
         */
        const ext = extname(file.originalname); // 파일의 확장자를 가져온다.
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          return callback(
            new BadRequestException('jpg, jpeg, png 파일만 업로드 가능합니다.'),
            false,
          );
        }
        return callback(null, true);
      },
      storage: multer.diskStorage({
        destination: (req, res, callback) => {
          callback(null, POST_IMAGE_PATH); // 이미지가 저장될 폴더, /{project_path}/public/posts
        },
        filename: (req, file, callback) => {
          callback(null, `${uuid()}${extname(file.originalname)}`); // 이미지 파일명, {uuid}{확장자}
        },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
