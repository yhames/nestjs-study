import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class BasePaginationDto {
  // 현재 페이지
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  // 이전 데이터의 마지막 id, 이 값이 주어지면 해당 id보다 큰 데이터를 가져온다.
  @IsNumber()
  @IsOptional()
  where__id__more_than?: number;

  @IsNumber()
  @IsOptional()
  where__id__less_than?: number;

  // 정렬 기준, 오름차순
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  // 가져올 데이터의 개수
  @IsNumber()
  @IsOptional()
  take: number = 20;
}
