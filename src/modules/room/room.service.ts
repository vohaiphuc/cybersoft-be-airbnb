import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  private prisma = new PrismaClient();

  async getAllRooms() {
    const roomList = await this.prisma.phong.findMany();
    return ResponseData(HttpStatus.OK, Message.ROOM.SUCCESS, roomList);
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id: createRoomDto.vi_tri_id },
    });
    if (!viTri) {
      throw new HttpException(Message.LOCATION.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.prisma.phong.create({
      data: createRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.CREATE_ROOM_SUCCESS, '');
  }

  async getRoomByLocationId(locationId: number) {
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id: locationId },
    });
    if (!viTri) {
      throw new HttpException(Message.LOCATION.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const roomByLocationId = await this.prisma.phong.findMany({
      where: {
        vi_tri_id: locationId,
      },
    });
    return ResponseData(
      HttpStatus.OK,
      Message.ROOM.SUCCESS_FIND_BY_ROOM_ID,
      roomByLocationId,
    );
  }

  async getAllRoomsPagination(
    pageIndex: number,
    pageSize: number,
    keyword: string,
  ) {
    if (pageIndex <= 0 || pageSize <= 0) {
      return ResponseData(
        HttpStatus.BAD_REQUEST,
        'Page index và Page size đều phải lớn hơn 0!',
        [],
      );
    }
    const roomListPagination = await this.prisma.phong.findMany({
      where: {
        ten_phong: {
          contains: keyword,
        },
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return ResponseData(
      HttpStatus.OK,
      Message.ROOM.SUCCESS_PAGINATION,
      roomListPagination,
    );
  }

  async getRoomById(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });
    return ResponseData(200, Message.ROOM.SUCCESS_ID, room);
  }

  async updateRoomById(id: number, updateRoomDto: UpdateRoomDto) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });
    if (!room) {
      throw new HttpException(Message.ROOM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id: updateRoomDto.vi_tri_id },
    });
    if (!viTri) {
      throw new HttpException(Message.LOCATION.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.prisma.phong.update({
      where: { id },
      data: updateRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.UPDATE_ROOM_SUCCESS, '');
  }

  async deleteRoomById(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });
    if (!room) {
      throw new HttpException(Message.ROOM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    const bookedRoom = await this.prisma.dat_phong.findFirst({
      where: {
        ma_phong: id,
      },
    });
    if (bookedRoom) {
      return ResponseData(
        HttpStatus.BAD_REQUEST,
        'Phòng đã được đặt, không thể xóa!',
        '',
      );
    }
    await this.prisma.phong.delete({
      where: { id },
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.DELETE_SUCESS, '');
  }

  async uploadRoomImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(Message.IMAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });
    if (!room) {
      throw new HttpException(Message.ROOM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    await this.prisma.phong.update({
      where: {
        id,
      },
      data: { hinh_anh: file.filename },
    });

    return ResponseData(HttpStatus.OK, Message.IMAGE.UPLOAD_SUCCESS, '');
  }
}
