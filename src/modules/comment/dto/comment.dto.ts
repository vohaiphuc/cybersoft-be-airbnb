import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CommentDto {
  @IsInt({ message: 'Room code must be a valid integer' })
  @IsNotEmpty({ message: 'Room code is required' })
  ma_phong: number;

  @IsInt({ message: 'User code must be a valid integer' })
  @IsNotEmpty({ message: 'Check-in date is required' })
  ma_nguoi_binh_luan: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Check-out date is required' })
  ngay_binh_luan: string;

  @IsNotEmpty({ message: 'comment is required' })
  noi_dung: string;

  @IsInt({ message: 'Star comment must be a valid integer' })
  @IsNotEmpty({ message: 'Star comment is required' })
  sao_binh_luan: number;
}
