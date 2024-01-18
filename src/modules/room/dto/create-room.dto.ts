import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  ten_phong: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  khach: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  phong_ngu: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  giuong: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  phong_tam: number;

  @ApiProperty()
  @IsString()
  mo_ta: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
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
  @Min(1)
  vi_tri_id: number;
}
