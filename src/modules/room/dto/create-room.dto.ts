import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  ten_phong: string;
  @ApiProperty()
  @IsNumber()
  khach: number;
  @ApiProperty()
  @IsNumber()
  phong_ngu: number;
  @ApiProperty()
  @IsNumber()
  giuong: number;
  @ApiProperty()
  @IsNumber()
  phong_tam: number;
  @ApiProperty()
  @IsString()
  mo_ta: string;
  @ApiProperty()
  @IsNumber()
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
  @IsNumber()
  vi_tri_id: number;
}
