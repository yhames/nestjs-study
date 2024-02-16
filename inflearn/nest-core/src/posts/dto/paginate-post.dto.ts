import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatePostDto {
  // 이전 데이터의 마지막 id, 이 값이 주어지면 해당 id보다 큰 데이터를 가져온다.
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  // 정렬 기준, 오름차순
  @IsIn(['ASC'])
  @IsOptional()
  order__createAt: 'ASC' | 'DESC' = 'ASC';

  // 가져올 데이터의 개수
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
