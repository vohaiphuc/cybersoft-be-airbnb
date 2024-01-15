import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  HttpException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { AdminJwtGuard, JwtGuard } from 'src/decorators/jwt-guard.decorator';
import { User } from 'src/decorators/user.decorator';
import { I_Data_Token } from '../auth/dto/token-auth.dto';

@ApiTags('Booking')
@Controller('api/dat-phong')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @AdminJwtGuard
  @Get('')
  getBookingList() {
    return this.bookingService.getBookingList();
  }

  @JwtGuard
  @Post('')
  postNewBookingSchedule(
    @User('data') data: I_Data_Token,
    @Body() dto: BookingDto,
  ) {
    const { email } = data;
    return this.bookingService.postNewBookingSchedule(dto, email);
  }

  @JwtGuard
  @Get(':id')
  getBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
  ) {
    const { email } = data;
    return this.bookingService.getBookingSchedule(id, email);
  }

  @JwtGuard
  @Put(':id')
  updateBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
    @Body() dto: BookingDto,
  ) {
    const { email } = data;
    return this.bookingService.updateBookingSchedule(id, dto, email);
  }

  @JwtGuard
  @Delete(':id')
  deleteBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
  ) {
    const { email } = data;
    return this.bookingService.deleteBookingSchedule(id, email);
  }

  @AdminJwtGuard
  @Get('lay-theo-nguoi-dung/:ma_nguoi_dat')
  async getBookingListByUser(
    @Param(
      'ma_nguoi_dat',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('Mã người dùng không hợp lệ', 404);
        },
      }),
    )
    ma_nguoi_dat: number,
  ) {
    return this.bookingService.getBookingListByUser(ma_nguoi_dat);
  }
}
