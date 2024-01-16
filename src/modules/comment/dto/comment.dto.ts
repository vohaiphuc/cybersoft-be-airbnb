import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsInt({ message: 'Dữ liệu không hợp lệ' })
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  ma_phong: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  noi_dung: string;

  @ApiProperty()
  @IsInt({ message: 'Dữ liệu không hợp lệ' })
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  sao_binh_luan: number;
}
