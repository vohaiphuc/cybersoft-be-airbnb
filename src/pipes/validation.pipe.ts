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

export class CustomParseIntPipe implements PipeTransform<string, number> {
  private readonly paramName: string;

  constructor(paramName: string) {
    this.paramName = paramName;
  }

  transform(value: string): number {
    const inputValue = parseInt(value, 10);

    if (isNaN(inputValue) || inputValue <= 0) {
      throw new BadRequestException(`${this.paramName} không hợp lệ`);
    }

    return inputValue;
  }
}

export class CustomImageFilePipe implements PipeTransform {
  async transform(file: Express.Multer.File): Promise<Express.Multer.File> {
    const imageFileTypeRegex = /\.(png|jpeg|jpg|gif|bmp|tiff|webp|svg)$/i;
    if (!imageFileTypeRegex.test(file.originalname)) {
      throw new BadRequestException('Không phải file hình!');
    }
    return file;
  }
}
