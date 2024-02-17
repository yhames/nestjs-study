import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB, 단위는 byte
      },
      fileFilter: (req, file, callback) => {
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
          callback(null, TEMP_FOLDER_PATH); // 이미지가 저장될 임시 폴더, /{project_path}/public/temp
        },
        filename: (req, file, callback) => {
          callback(null, `${uuid()}${extname(file.originalname)}`); // 이미지 파일명, {uuid}{확장자}
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
