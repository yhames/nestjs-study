import { BadRequestException, Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { BaseModel } from './entity/base.entity';
import { FILTER_MAPPER } from './const/filter-mapper.const';
import { HOST, PROTOCOL } from './const/env.const';

@Injectable()
export class CommonService {
  paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    }
    return this.cursorPaginate(dto, repository, overrideFindOptions, path);
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {}

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    // 해당되는 포스트가 0개 이상이면, 마지막 포스트를 가져오고, 그렇지 않으면 null을 반환한다.
    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }
      let key = null;
      if (dto.order__createAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id_less_than';
      }
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  /**
   * @return where, order, take, skip(page)
   */
  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * DTO 구조
     * {
     *   where__id__less_than: number;
     *   order__createAt: 'ASC' | 'DESC';
     * }
     *
     * where__id__less_than 뿐만 아니라 where__likeCount__less_than 등 추가 필터를 넣어야한다.
     *
     * 1. where로 시작하면 필터 로직을 적용한다.
     * 2. order로 시작하면 정렬 로직을 적용한다.
     * 3. 필터 로직을 적용한다면 '__' 기준으로 split을 했을 때 3개의 값으로 나뉘는지 2개의 값으로 나뉘는지 확인한다.
     *    - 3개로 나뉘면 FILTER_MAPPER에서 해당하는 operator()를 찾아서 적용한다. (ex. LessThan, MoreThan)
     *    - 2개로 나뉘면 정확한 값을 필터하는 것이기 떄문에 operator() 없이 적용한다.
     * 4. order의 경우 3-2번과 같은 방식으로 적용한다.
     */
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      // key -> where__id__less_than
      // value -> 1
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhere(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhere(key, value),
        };
      }
    }
    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhere<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {};
    const split = key.split('__');
    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'를 기준으로 2개 또는 3개의 값으로 나뉘어야 합니다. ${key}`,
      );
    }

    if (split.length === 2) {
      const [_, field] = split;
      options[field] = value;
    }

    if (split.length === 3) {
      const [_, field, operator] = split;
      if (!FILTER_MAPPER[operator]) {
        throw new BadRequestException(
          `해당하는 필터가 없습니다. ${operator} ${key}`,
        );
      }
      options[field] = FILTER_MAPPER[operator](value);
    }

    return options;
  }

  private parseOrder<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsOrder<T> {
    const order: FindOptionsOrder<T> = {};
    const split = key.split('__');
    if (split.length !== 2) {
      throw new BadRequestException(
        `order 필터는 '__'를 기준으로 2개의 값으로 나뉘어야 합니다. ${key}`,
      );
    }
    const [_, field] = split;
    order[field] = value;
    return order;
  }
}
