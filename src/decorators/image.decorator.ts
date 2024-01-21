import {
  applyDecorators,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageRegex } from '../common/const/regex.const';

export const UseUploadImage = (fieldName: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        limits: {
          files: 1,
        },
        fileFilter: (_, file, callback) => {
          if (!file) {
            callback(new BadRequestException('Không có file hình nhé!'), false);
          }
          if (!file.originalname.match(imageRegex)) {
            callback(
              new BadRequestException('Không phải file hình nhé!'),
              false,
            );
          }
          callback(null, true);
        },
        storage: diskStorage({
          destination: process.cwd() + '/public/img',
          filename: (_, file, callback) =>
            callback(null, new Date().getTime() + '_' + file.originalname),
        }),
      }),
    ),
  );
};
