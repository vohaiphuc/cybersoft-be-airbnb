import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  private prisma = new PrismaClient();

  private async locationValid(id: number) {
    const location = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    if (!location) {
      throw new HttpException(Message.LOCATION.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return location;
  }

  private async roomValid(id: number) {
    const room = await this.prisma.phong.findUnique({
      where: { id },
    });
    if (!room) {
      throw new HttpException(Message.ROOM.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return room;
  }

  async getAllRooms() {
    const roomList = await this.prisma.phong.findMany();
    return ResponseData(HttpStatus.OK, Message.ROOM.SUCCESS, roomList);
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    await this.locationValid(createRoomDto.vi_tri_id);
    await this.prisma.phong.create({
      data: createRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.CREATE_SUCCESS, '');
  }

  async getRoomByLocationId(locationId: number) {
    await this.locationValid(locationId);
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
    const room = await this.roomValid(id);
    return ResponseData(HttpStatus.OK, Message.ROOM.SUCCESS_ID, room);
  }

  async updateRoomById(id: number, updateRoomDto: UpdateRoomDto) {
    await this.roomValid(id);
    await this.locationValid(updateRoomDto.vi_tri_id);
    await this.prisma.phong.update({
      where: { id },
      data: updateRoomDto,
    });
    return ResponseData(HttpStatus.OK, Message.ROOM.UPDATE_SUCCESS, '');
  }

  async deleteRoomById(id: number) {
    await this.roomValid(id);
    const bookedRoom = await this.prisma.dat_phong.findFirst({
      where: {
        ma_phong: id,
      },
    });
    if (bookedRoom) {
      return ResponseData(HttpStatus.BAD_REQUEST, Message.ROOM.DELETE_FAIL, '');
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
    await this.roomValid(id);
    await this.prisma.phong.update({
      where: {
        id,
      },
      data: { hinh_anh: file.filename },
    });

    return ResponseData(HttpStatus.OK, Message.IMAGE.UPLOAD_SUCCESS, '');
  }
}
