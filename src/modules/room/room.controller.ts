import {
  Controller,
  Body,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CustomValidationPipe } from 'src/pipes/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UploadRoomImageDto } from './dto/upload-room-image.dto copy';

@ApiTags('Room')
@Controller('/api/rooms')
@UseFilters(HttpExceptionFilter)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('')
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  @Post('')
  createRoom(@Body(CustomValidationPipe) createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get('get-room-by-location-id')
  getRoomByLocationId(@Query('locationId') locationId: string) {
    return this.roomService.getRoomByLocationId(+locationId);
  }

  @Get('pagination-search')
  getAllRoomsPagination(
    @Query('pageIndex') pageIndex: string,
    @Query('pageSize') pageSize: string,
    @Query('keyword') keyword: string,
  ) {
    return this.roomService.getAllRoomsPagination(
      +pageIndex,
      +pageSize,
      keyword,
    );
  }

  @Get(':id')
  getRoomById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
  ) {
    return this.roomService.getRoomById(id);
  }

  @Put(':id')
  updateRoomById(
    @Body(CustomValidationPipe) updateRoomDto: UpdateRoomDto,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
  ) {
    return this.roomService.updateRoomById(id, updateRoomDto);
  }

  @Delete(':id')
  deleteRoomById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
  ) {
    return this.roomService.deleteRoomById(id);
  }

  @Post('/upload-image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (_, file, callback) =>
          callback(null, new Date().getTime() + '_' + file.originalname),
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadRoomImageDto,
  })
  uploadRoomImage(
    @Req() request,
    @Query('roomId') roomId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const token = '';
    return this.roomService.uploadRoomImage(+roomId, token, file);
  }
}
