import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const bookingList = await this.prisma.dat_phong.findMany({});

    return ResponseData(
      HttpStatus.OK,
      Message.BOOKING.LIST_ALL_SUCCESS,
      bookingList,
    );
  }

  async getBookingSchedule(id: number, email: string) {
    const user = await this.userService.verifyUser(email);
    const userRole = user.role;
    const { USER } = Role;

    const bookingSchedule = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });

    if (userRole === USER && user.id !== bookingSchedule.ma_nguoi_dat)
      throw new HttpException(
        Message.BOOKING.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );

    return ResponseData(
      HttpStatus.OK,
      Message.BOOKING.GET_SUCCESS,
      bookingSchedule,
    );
  }

  async getBookingListByUser(ma_nguoi_dat: number) {
    const bookingListByUser = await this.prisma.dat_phong.findMany({
      where: { ma_nguoi_dat },
    });

    return ResponseData(
      HttpStatus.OK,
      Message.BOOKING.GET_BY_USER_SUCCESS,
      bookingListByUser,
    );
  }

  async postNewBookingSchedule(dto: BookingDto, email: string) {
    const user = await this.userService.verifyUser(email);

    const isRoomValid = await this.prisma.phong.findUnique({
      where: { id: dto.ma_phong },
    });
    if (!isRoomValid)
      throw new HttpException(Message.BOOKING.NOT_FOUND, HttpStatus.NOT_FOUND);

    const bookingList = await this.prisma.dat_phong.findMany({
      where: { ma_phong: dto.ma_phong },
    });
    let isBookingValid = true;
    bookingList.forEach((item) => {
      const dateCheckInInput = new Date(dto.ngay_den);
      const dateCheckOutInput = new Date(dto.ngay_di);
      if (
        !(dateCheckOutInput < item.ngay_den || item.ngay_di < dateCheckInInput)
      ) {
        isBookingValid = false;
      }
    });
    if (!isBookingValid)
      throw new HttpException(
        Message.BOOKING.DOUBLE_BOOKED,
        HttpStatus.BAD_REQUEST,
      );
    await this.prisma.dat_phong.create({
      data: { ...dto, ma_nguoi_dat: user.id },
    });

    return ResponseData(HttpStatus.OK, Message.BOOKING.POST_SUCCESS, '');
  }

  async updateBookingSchedule(id: number, dto: BookingDto, email: string) {
    const user = await this.userService.verifyUser(email);
    const userRole = user.role;
    const { USER } = Role;
    const oldSchedule = await this.prisma.dat_phong.findUnique({
      where: {
        id,
      },
    });

    if (!oldSchedule) {
      throw new HttpException(Message.BOOKING.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    if (userRole === USER && user.id !== oldSchedule.ma_nguoi_dat) {
      throw new HttpException(
        Message.BOOKING.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );
    }
    const bookingList = await this.prisma.dat_phong.findMany({
      where: { ma_phong: dto.ma_phong },
    });

    let isBookingValid = true;
    bookingList.forEach((item) => {
      const dateCheckInInput = new Date(dto.ngay_den);
      const dateCheckOutInput = new Date(dto.ngay_di);
      if (id !== item.id) {
        if (
          !(
            dateCheckOutInput < item.ngay_den || item.ngay_di < dateCheckInInput
          )
        ) {
          isBookingValid = false;
        }
      }
    });
    if (!isBookingValid)
      throw new HttpException(
        Message.BOOKING.DOUBLE_BOOKED,
        HttpStatus.BAD_REQUEST,
      );
    await this.prisma.dat_phong.update({
      where: {
        id,
      },
      data: dto,
    });

    return ResponseData(HttpStatus.OK, Message.BOOKING.UPDATED_SUCCESS, '');
  }

  async deleteBookingSchedule(id: number, email: string) {
    const user = await this.userService.verifyUser(email);
    const userRole = user.role;
    const { USER } = Role;

    const oldSchedule = await this.prisma.dat_phong.findUnique({
      where: { id },
    });

    if (!oldSchedule) {
      throw new HttpException(Message.BOOKING.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (userRole === USER && user.id !== oldSchedule.ma_nguoi_dat)
      throw new HttpException(
        Message.BOOKING.FORBIDDEN,
        HttpStatus.FORBIDDEN,
      );

    await this.prisma.dat_phong.delete({
      where: {
        id,
      },
    });
    return ResponseData(HttpStatus.OK, Message.BOOKING.DELETED_SUCCESS, '');
  }
}
