import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import {
  IsDateAfterCheckinDay,
  IsDateAfterToday,
} from 'src/decorators/booking.decorator';

export class BookingDto {
  @ApiProperty()
  @IsInt({ message: 'Mã phòng phải là số nguyên hợp lệ' })
  @IsNotEmpty({ message: 'Mã phòng không được để trống' })
  @IsPositive({ message: 'Dữ liệu không được bé hơn 1' })
  ma_phong: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày đến không được để trống' })
  @IsDateAfterToday()
  ngay_den: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày đi không được để trống' })
  @IsDateAfterCheckinDay()
  ngay_di: Date;

  @ApiProperty()
  @IsInt({ message: 'Số lượng khách phải là số nguyên hợp lệ' })
  @IsNotEmpty({ message: 'Số lượng khách không được để trống' })
  @IsPositive({ message: 'Dữ liệu không được bé hơn 1' })
  so_luong_khach: number;
}
