import { ApiProperty } from '@nestjs/swagger';

export class UploadRoomImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
