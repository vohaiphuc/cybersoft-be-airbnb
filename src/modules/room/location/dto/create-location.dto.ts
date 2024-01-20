import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tên vị trí không được để trống' })
  ten_vi_tri: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tỉnh thành không được để trống' })
  tinh_thanh: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Quốc gia không được để trống' })
  quoc_gia: string;
}
