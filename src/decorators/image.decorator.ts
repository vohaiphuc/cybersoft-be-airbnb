import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const UseUploadImage = (fieldName: string) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(fieldName, {
        storage: diskStorage({
          destination: process.cwd() + '/public/img',
          filename: (_, file, callback) =>
            callback(null, new Date().getTime() + '_' + file.originalname),
        }),
        limits: {
          files: 1,
        },
      }),
    ),
  );
};
