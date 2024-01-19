import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';
import { AdminJwtGuard, JwtGuard } from 'src/decorators/jwt-guard.decorator';
import { User } from 'src/decorators/user.decorator';
import { I_Data_Token } from '../auth/dto/token-auth.dto';
import {
  CustomValidationPipe,
  CustomParseIntPipe,
} from 'src/pipes/validation.pipe';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';

@ApiTags('Booking')
@UseFilters(HttpExceptionFilter)
@Controller('api/dat-phong')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @AdminJwtGuard
  @Get('')
  getBookingList() {
    return this.bookingService.getBookingList();
  }

  @JwtGuard
  @Get(':id')
  getBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param('id', new CustomParseIntPipe('id')) id: number,
  ) {
    const { email } = data;
    return this.bookingService.getBookingSchedule(id, email);
  }

  @AdminJwtGuard
  @Get('lay-theo-nguoi-dung/:ma_nguoi_dat')
  async getBookingListByUser(
    @Param('ma_nguoi_dat', new CustomParseIntPipe('ma_nguoi_dat'))
    ma_nguoi_dat: number,
  ) {
    return this.bookingService.getBookingListByUser(ma_nguoi_dat);
  }

  @JwtGuard
  @Post('')
  postNewBookingSchedule(
    @User('data') data: I_Data_Token,
    @Body(CustomValidationPipe) dto: BookingDto,
  ) {
    const { email } = data;
    return this.bookingService.postNewBookingSchedule(dto, email);
  }

  @JwtGuard
  @Put(':id')
  updateBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param('id', new CustomParseIntPipe('id')) id: number,
    @Body(CustomValidationPipe) dto: BookingDto,
  ) {
    const { email } = data;
    return this.bookingService.updateBookingSchedule(id, dto, email);
  }

  @JwtGuard
  @Delete(':id')
  deleteBookingSchedule(
    @User('data') data: I_Data_Token,
    @Param('id', new CustomParseIntPipe('id')) id: number,
  ) {
    const { email } = data;
    return this.bookingService.deleteBookingSchedule(id, email);
  }
}
