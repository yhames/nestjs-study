import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';

/**
 * PartialType()은 `CreatePostDto`의 모든 필드를 선택적으로 만든다.
 */
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({ message: stringValidationMessage })
  @IsOptional()
  title?: string;

  @IsString({ message: stringValidationMessage })
  @IsOptional()
  content?: string;
}
