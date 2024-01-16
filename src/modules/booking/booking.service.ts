import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BookingDto } from './dto/booking.dto';
import { ResponseData } from 'src/common/util/response.utils';
import { Message } from 'src/common/const/message.const';
import { UserService } from '../user/user.service';
import { Role } from '../auth/dto/auth.dto';

@Injectable()
export class BookingService {
  constructor(private readonly userService: UserService) {}
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

  async postNewBookingSchedule(dto: BookingDto, email: string) {
    try {
      const user = await this.userService.verifyUser(email);

      const bookingSchedule = await this.prisma.dat_phong.create({
        data: { ...dto, ma_nguoi_dat: user.id },
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

  async getBookingSchedule(id: number, email: string) {
    try {
      const user = await this.userService.verifyUser(email);
      const userRole = user.role;
      const { ADMIN, USER } = Role;

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
      if (userRole === USER && user.id !== bookingSchedule.ma_nguoi_dat) {
        return ResponseData(
          HttpStatus.UNAUTHORIZED,
          Message.COMMENT.UNAUTHORIZED,
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

  async updateBookingSchedule(id: number, dto: BookingDto, email: string) {
    try {
      const user = await this.userService.verifyUser(email);
      const userRole = user.role;
      const { ADMIN, USER } = Role;
      const oldSchedule = await this.prisma.dat_phong.findUnique({
        where: {
          id,
        },
      });

      if (oldSchedule === null) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }
      if (userRole === USER && user.id !== oldSchedule.ma_nguoi_dat) {
        return ResponseData(
          HttpStatus.UNAUTHORIZED,
          Message.COMMENT.UNAUTHORIZED,
          null,
        );
      }

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

  async deleteBookingSchedule(id: number, email: string) {
    try {
      const user = await this.userService.verifyUser(email);
      const userRole = user.role;
      const { ADMIN, USER } = Role;

      let oldSchedule = await this.prisma.dat_phong.findUnique({
        where: { id },
      });

      if (!oldSchedule) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.BOOKING.NOT_FOUND,
          null,
        );
      }

      if (userRole === USER && user.id !== oldSchedule.ma_nguoi_dat) {
        return ResponseData(
          HttpStatus.UNAUTHORIZED,
          Message.COMMENT.UNAUTHORIZED,
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
