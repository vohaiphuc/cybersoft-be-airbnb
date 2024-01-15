import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BookingDto } from './dto/booking.dto';
import { ResponseData } from 'src/common/util/response.utils';
import { Message } from 'src/common/const/message.const';

@Injectable()
export class BookingService {
  private prisma = new PrismaClient();

  async getBookingList() {
    try {
      const bookingList = await this.prisma.dat_phong.findMany({});
      if (bookingList === null) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.LIST_ALL_SUCCESS,
        bookingList,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }

  async postNewBookingSchedule(dto: BookingDto) {
    try {
      const bookingSchedule = await this.prisma.dat_phong.create({
        data: {
          ma_phong: dto.ma_phong,
          ngay_den: dto.ngay_den,
          ngay_di: dto.ngay_di,
          so_luong_khach: dto.so_luong_khach,
          ma_nguoi_dat: dto.ma_nguoi_dat,
        },
      });
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.POST_BOOKING_SUCCESS,
        bookingSchedule,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }

  async getBookingSchedule(id: number) {
    try {
      const bookingSchedule = await this.prisma.dat_phong.findUnique({
        where: {
          id,
        },
      });
      if (bookingSchedule === null) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.GET_BOOKING_SUCCESS,
        bookingSchedule,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }

  async updateBookingSchedule(id: number, dto: BookingDto) {
    try {
      const bookingSchedule = await this.prisma.dat_phong.update({
        where: {
          id,
        },
        data: dto,
      });
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.UPDATED_BOOKING_SUCCESS,
        bookingSchedule,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }

  async deleteBookingSchedule(id: number) {
    try {
      let checkAvailable = await this.prisma.dat_phong.findUnique({
        where: { id },
      });
      if (!checkAvailable) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }
      const bookingSchedule = await this.prisma.dat_phong.delete({
        where: {
          id,
        },
      });
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.DELETED_BOOKING_SUCCESS,
        bookingSchedule,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }

  async getBookingListByUser(ma_nguoi_dat: number) {
    try {
      const bookingListByUser = await this.prisma.dat_phong.findMany({
        where: { ma_nguoi_dat },
      });
      if (bookingListByUser.length === 0) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }
      return ResponseData(
        HttpStatus.OK,
        Message.BOOKING.GET_BOOKING_BY_USER_SUCCESS,
        bookingListByUser,
      );
    } catch (error) {
      throw new Error(`${Message.BOOKING.FAIL} ${error.message}`);
    }
  }
}
