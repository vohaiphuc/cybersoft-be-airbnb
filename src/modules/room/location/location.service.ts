import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
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

  async getAllLocations() {
    const locationList = await this.prisma.vi_tri.findMany();
    return ResponseData(HttpStatus.OK, Message.LOCATION.SUCCESS, locationList);
  }

  async createLocation(createLocationDto: CreateLocationDto) {
    await this.prisma.vi_tri.create({
      data: createLocationDto,
    });
    return ResponseData(HttpStatus.OK, Message.LOCATION.CREATE_SUCCESS, '');
  }

  async getAllLocationsPagination(
    pageIndex: number,
    pageSize: number,
    keyword: string,
  ) {
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
    const location = await this.locationValid(id);
    return ResponseData(HttpStatus.OK, Message.LOCATION.SUCCESS_ID, location);
  }

  async updateLocationById(id: number, updateLocationDto: UpdateLocationDto) {
    await this.locationValid(id);
    await this.prisma.vi_tri.update({
      where: { id },
      data: updateLocationDto,
    });
    return ResponseData(HttpStatus.OK, Message.LOCATION.UPDATE_SUCCESS, '');
  }

  async deleteLocationById(id: number) {
    await this.locationValid(id);
    const usedLocation = await this.prisma.phong.findFirst({
      where: { vi_tri_id: id },
    });
    if (usedLocation) {
      throw new HttpException(
        Message.LOCATION.DELETE_FAIL,
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.prisma.vi_tri.delete({
      where: { id },
    });
    return ResponseData(HttpStatus.OK, Message.LOCATION.DELETE_SUCESS, '');
  }

  async uploadLocationImage(id: number, file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(Message.IMAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    await this.locationValid(id);
    await this.prisma.vi_tri.update({
      where: {
        id,
      },
      data: { hinh_anh: file.filename },
    });

    return ResponseData(HttpStatus.OK, Message.IMAGE.UPLOAD_SUCCESS, '');
  }
}
