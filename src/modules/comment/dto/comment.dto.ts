import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty()
  @IsInt({ message: 'Dữ liệu không hợp lệ' })
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  @IsPositive({ message: 'Dữ liệu không được bé hơn 1' })
  ma_phong: number;

  @ApiProperty()
  @IsString({ message: 'Dữ liệu không hợp lệ' })
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  noi_dung: string;

  @ApiProperty()
  @IsInt({ message: 'Dữ liệu không hợp lệ' })
  @IsNotEmpty({ message: 'Dữ liệu không được để trống' })
  @IsIn([1, 2, 3, 4, 5], { message: 'Giá trị chỉ được phép từ 1 đến 5' })
  sao_binh_luan: number;
}
