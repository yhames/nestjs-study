import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/**
 * PartialType()은 `CreatePostDto`의 모든 필드를 선택적으로 만든다.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
