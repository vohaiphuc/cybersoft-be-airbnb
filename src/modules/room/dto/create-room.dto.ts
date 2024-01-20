import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Tên phòng không được để trống' })
  ten_phong: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  khach: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  phong_ngu: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  giuong: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  phong_tam: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Mô tả không được để trống' })
  mo_ta: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1e9)
  gia_tien: number;

  @ApiProperty()
  @IsBoolean()
  may_giat: boolean;

  @ApiProperty()
  @IsBoolean()
  ban_ui: boolean;

  @ApiProperty()
  @IsBoolean()
  tivi: boolean;

  @ApiProperty()
  @IsBoolean()
  dieu_hoa: boolean;

  @ApiProperty()
  @IsBoolean()
  wifi: boolean;

  @ApiProperty()
  @IsBoolean()
  bep: boolean;

  @ApiProperty()
  @IsBoolean()
  do_xe: boolean;

  @ApiProperty()
  @IsBoolean()
  ho_boi: boolean;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  vi_tri_id: number;
}
