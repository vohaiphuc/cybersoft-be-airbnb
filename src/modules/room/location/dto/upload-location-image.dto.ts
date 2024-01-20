import { ApiProperty } from '@nestjs/swagger';

export class UploadLocationImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
