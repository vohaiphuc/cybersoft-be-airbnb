import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  private prisma = new PrismaClient();

  async getAllLocations() {
    const locationList = await this.prisma.vi_tri.findMany();
    return ResponseData(HttpStatus.OK, Message.LOCATION.SUCCESS, locationList);
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    await this.prisma.vi_tri.create({
      data: createLocationDto,
    });
    return ResponseData(
      HttpStatus.OK,
      Message.LOCATION.CREATE_LOCATION_SUCCESS,
      '',
    );
  }

  async getAllLocationsPagination(pageIndex, pageSize, keyword) {
    const locationListPagination = await this.prisma.vi_tri.findMany({
      where: {
        ten_vi_tri: {
          contains: keyword,
        },
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });
    return ResponseData(
      HttpStatus.OK,
      Message.LOCATION.SUCCESS_PAGINATION,
      locationListPagination,
    );
  }

  async getLocationById(id: number) {
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    if (!viTri) {
      return ResponseData(HttpStatus.NOT_FOUND, Message.LOCATION.NOT_FOUND, '');
    }
    const location = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    return ResponseData(200, Message.LOCATION.SUCCESS_ID, location);
  }

  async updateLocationById(id: number, updateLocationDto: UpdateLocationDto) {
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    if (!viTri) {
      return ResponseData(HttpStatus.NOT_FOUND, Message.LOCATION.NOT_FOUND, '');
    }
    await this.prisma.vi_tri.update({
      where: { id },
      data: updateLocationDto,
    });
    return ResponseData(
      HttpStatus.OK,
      Message.LOCATION.UPDATE_LOCATION_SUCCESS,
      '',
    );
  }

  async deleteLocationById(id: number) {
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    if (!viTri) {
      return ResponseData(HttpStatus.NOT_FOUND, Message.LOCATION.NOT_FOUND, '');
    }
    await this.prisma.vi_tri.delete({
      where: { id },
    });
    return ResponseData(HttpStatus.OK, Message.LOCATION.DELETE_SUCESS, '');
  }

  async uploadLocationImage(id, file: Express.Multer.File) {
    if (!file) {
      return ResponseData(HttpStatus.BAD_REQUEST, Message.IMAGE.NOT_FOUND, '');
    }
    const viTri = await this.prisma.vi_tri.findUnique({
      where: { id },
    });
    if (!viTri) {
      return ResponseData(HttpStatus.NOT_FOUND, Message.LOCATION.NOT_FOUND, '');
    }
    await this.prisma.vi_tri.update({
      where: {
        id,
      },
      data: { hinh_anh: file.filename },
    });

    return ResponseData(HttpStatus.OK, Message.IMAGE.UPLOAD_SUCCESS, '');
  }
}
