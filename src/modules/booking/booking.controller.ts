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

@ApiTags('Booking')
@Controller('api/dat-phong')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Get('')
  getBookingList() {
    return this.bookingService.getBookingList();
  }

  @Post('')
  postNewBookingSchedule(@Body() dto: BookingDto) {
    return this.bookingService.postNewBookingSchedule(dto);
  }

  @Get(':id')
  getBookingSchedule(
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
    return this.bookingService.getBookingSchedule(id);
  }

  @Put(':id')
  updateBookingSchedule(
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
    return this.bookingService.updateBookingSchedule(id, dto);
  }

  @Delete(':id')
  deleteBookingSchedule(
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
    return this.bookingService.deleteBookingSchedule(id);
  }

  @Get('lay-theo-nguoi-dung/:ma_nguoi_dat')
  async getBookingListByUser(
    @Param(
      'ma_nguoi_dat',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    ma_nguoi_dat: number,
  ) {
    return this.bookingService.getBookingListByUser(ma_nguoi_dat);
  }
}
