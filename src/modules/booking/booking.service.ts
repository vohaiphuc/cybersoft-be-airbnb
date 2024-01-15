import { ForbiddenException, Injectable } from '@nestjs/common';
import { BookingDto } from './dto/booking.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  async getBookingList() {
    const bookingList = await this.prisma.dat_phong.findMany({});
    return {
      message: 'All Booking Schedule loaded successful',
      data: { bookingList },
    };
  }
  async postNewBookingSchedule(dto: BookingDto) {
    const bookingSchedule = await this.prisma.dat_phong.create({
      data: {
        ma_phong: dto.ma_phong,
        ngay_den: dto.ngay_den,
        ngay_di: dto.ngay_di,
        so_luong_khach: dto.so_luong_khach,
        ma_nguoi_dat: dto.ma_nguoi_dat,
      },
    });
    return {
      message: 'New Booking Schedule created successfully',
      data: { bookingSchedule },
    };
  }

  async getBookingSchedule(id: number) {
    const bookingSchedule = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });
    return {
      message: 'Booking Schedule loaded successful',
      data: { bookingSchedule },
    };
  }

  async updateBookingSchedule(id: number, dto: BookingDto) {
    const bookingSchedule = await this.prisma.dat_phong.update({
      where: {
        id,
      },
      data: dto,
    });
    return {
      message: 'Booking Schedule updated successful',
      data: { bookingSchedule },
    };
  }

  async deleteBookingSchedule(id: number) {
    let checkAvailable = await this.prisma.dat_phong.findUnique({
      where: { id },
    });
    if (!checkAvailable)
      throw new ForbiddenException('No booking Schedule match your request');
    const bookingSchedule = await this.prisma.dat_phong.delete({
      where: {
        id,
      },
    });
    return {
      message: 'Delete booking Schedule successful',
      data: { bookingSchedule },
    };
  }

  async getBookingListByUser(ma_nguoi_dat: number) {
    const bookingListByUser = await this.prisma.dat_phong.findMany({
      where: { ma_nguoi_dat },
    });
    if (bookingListByUser.length === 0)
      throw new ForbiddenException('No booking Schedule match your request');
    return {
      message: 'All Booking Schedule By User loaded successful',
      data: { bookingListByUser },
      ma_nguoi_dat,
    };
  }
}
