import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const errValues = errors
        .map((err) => `${err.property} (${Object.values(err.constraints)[0]})`)
        .join(', ');
      throw new BadRequestException(`Dữ liệu không hợp lệ: ${errValues}`, {
        cause: errors,
      });
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

export class CustomParseIntPipe {
  transform(value: string): number {
    const id = parseInt(value, 10);

    if (isNaN(id) || id <= 0) {
      throw new BadRequestException('ID không hợp lệ');
    }

    return id;
  }
}
