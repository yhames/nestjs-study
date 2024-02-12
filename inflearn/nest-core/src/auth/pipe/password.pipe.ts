import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * CustomPipe를 생성하기 위해서는 `PipeTransform` 인터페이스를 구현해야 한다.
 */
@Injectable()
export class PasswordPipe implements PipeTransform {
  /**
   * ArgumentMetadata: 파이프가 적용되는 파라미터에 대한 정보를 포함한다.
   *  - type: 파라미터의 타입 (body, query, param, custom)
   *  - metatype: routeHandler 메서드의 타입 정의에 기반한 파라미터의 기본 타입
   *  - data: 데코레이터에 전달된 문자열
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length < 8) {
      throw new BadRequestException('비밀번호는 8자 이하로 입력하주세요.');
    }
    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length > this.length) {
      throw new BadRequestException(`최대 길이는 ${this.length}자 입니다.`);
    }
    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length < this.length) {
      throw new BadRequestException(`최소 길이는 ${this.length}자 입니다.`);
    }
    return value.toString();
  }
}
