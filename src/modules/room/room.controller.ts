import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CustomValidationPipe,
  CustomParseIntPipe,
  CustomImageFilePipe,
} from 'src/pipes/validation.pipe';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { UploadRoomImageDto } from './dto/upload-room-image.dto';
import { AdminJwtGuard } from 'src/decorators/jwt-guard.decorator';
import { UseUploadImage } from 'src/decorators/image.decorator';

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

  @AdminJwtGuard
  @Post('')
  createRoom(@Body(CustomValidationPipe) createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Get('get-room-by-location-id')
  getRoomByLocationId(
    @Query('locationId', new CustomParseIntPipe('locationId'))
    locationId: number,
  ) {
    return this.roomService.getRoomByLocationId(locationId);
  }

  @Get('pagination-search')
  @ApiQuery({ name: 'keyword', required: false })
  getAllRoomsPagination(
    @Query('pageIndex', new CustomParseIntPipe('pageIndex'))
    pageIndex: number,
    @Query('pageSize', new CustomParseIntPipe('pageSize'))
    pageSize: number,
    @Query('keyword') keyword: string,
  ) {
    return this.roomService.getAllRoomsPagination(pageIndex, pageSize, keyword);
  }

  @Get(':id')
  getRoomById(
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.roomService.getRoomById(id);
  }

  @AdminJwtGuard
  @Put(':id')
  updateRoomById(
    @Body(CustomValidationPipe) updateRoomDto: UpdateRoomDto,
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.roomService.updateRoomById(id, updateRoomDto);
  }

  @AdminJwtGuard
  @Delete(':id')
  deleteRoomById(
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.roomService.deleteRoomById(id);
  }

  @AdminJwtGuard
  @Post('/upload-image')
  @UseUploadImage('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadRoomImageDto,
  })
  uploadRoomImage(
    @Query('roomId', new CustomParseIntPipe('roomId'))
    roomId: number,
    @UploadedFile(new CustomImageFilePipe())
    file: Express.Multer.File,
  ) {
    return this.roomService.uploadRoomImage(roomId, file);
  }
}
