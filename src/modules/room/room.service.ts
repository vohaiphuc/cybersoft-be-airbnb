import { HttpStatus, Injectable } from '@nestjs/common';
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
    await this.prisma.phong.create({
      data: createRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.CREATE_ROOM_SUCCESS, '');
  }

  async getAllRoomsPagination(pageIndex, pageSize, keyword) {
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
    await this.prisma.phong.update({
      where: { id },
      data: updateRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.UPDATE_ROOM_SUCCESS, '');
  }

  async deleteRoomById(id: number) {
    await this.prisma.phong.delete({
      where: { id },
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.DELETE_SUCESS, '');
  }

  async uploadRoomImage(id, token, file: Express.Multer.File) {
    if (!file) {
      return ResponseData(HttpStatus.BAD_REQUEST, Message.IMAGE.NOT_FOUND, '');
    }
    // const tokenRealData = this.jwtService.decode(token);
    // if (data.ma_nguoi_tao !== tokenRealData.user_id) {
    //   return responseData(403, "Forbidden! Not user's created job!", '');
    // }
    await this.prisma.phong.update({
      where: {
        id,
      },
      data: { hinh_anh: file.filename },
    });

    return ResponseData(HttpStatus.OK, Message.IMAGE.SAVED, '');
  }
}
