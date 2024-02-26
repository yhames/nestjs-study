import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from '../../common/entity/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePostImageDto } from './dto/create-image.dto';
import { basename, join } from 'path';
import {
  POST_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from '../../common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostsImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    if (qr) {
      return qr.manager.getRepository<ImageModel>(ImageModel);
    }
    return this.imageRepository;
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      await promises.access(tempFilePath); // 파일이 존재하지 않으면 에러가 발생한다.
    } catch (e) {
      throw new NotFoundException('파일이 존재하지 않습니다.');
    }

    // 파일 이름을 추출한다. (ex: /public/temp/{uuid}.jpg -> {uuid}.jpg)
    const fileName = basename(tempFilePath);

    // 이동할 경로를 생성한다.  (ex: /public/posts/{uuid}.jpg)
    const newPath = join(POST_IMAGE_PATH, fileName);

    // save
    const result = await repository.save({
      ...dto,
    });

    // 파일을 이동한다.
    await promises.rename(tempFilePath, newPath);

    return result;
  }
}
