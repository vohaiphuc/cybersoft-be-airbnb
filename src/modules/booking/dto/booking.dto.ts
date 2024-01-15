import { IsDateString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class BookingDto {
  @IsInt({ message: 'Room code must be a valid integer' })
  @IsNotEmpty({ message: 'Room code is required' })
  ma_phong: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Check-in date is required' })
  ngay_den: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Check-out date is required' })
  ngay_di: string;

  @IsInt({ message: 'Number of guests must be a valid integer' })
  @IsNotEmpty({ message: 'Number of guests is required' })
  so_luong_khach: number;

  @IsInt({ message: 'User code must be a valid integer' })
  @IsNotEmpty({ message: 'User code is required' })
  ma_nguoi_dat: number;
}
