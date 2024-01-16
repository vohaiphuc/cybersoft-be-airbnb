import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { CreateLocationDto } from './dto/create-location.dto';
import { CustomValidationPipe } from 'src/pipes/validation.pipe';
import { UpdateLocationDto } from './dto/update-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadLocationImageDto } from './dto/upload-location-image.dto';
import { AdminJwtGuard } from 'src/decorators/jwt-guard.decorator';
import { Message } from 'src/common/const/message.const';

@ApiTags('Location')
@Controller('/api/locations')
@UseFilters(HttpExceptionFilter)
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('')
  getAllLocations() {
    return this.locationService.getAllLocations();
  }

  @AdminJwtGuard
  @Post('')
  createLocation(
    @Body(CustomValidationPipe) createLocationDto: CreateLocationDto,
  ) {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get('pagination-search')
  getAllLocationsPagination(
    @Query('pageIndex') pageIndex: string,
    @Query('pageSize') pageSize: string,
    @Query('keyword') keyword: string,
  ) {
    return this.locationService.getAllLocationsPagination(
      +pageIndex,
      +pageSize,
      keyword,
    );
  }

  @Get(':id')
  getLocationById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException(
            Message.REQUEST.ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    id: number,
  ) {
    return this.locationService.getLocationById(id);
  }

  @AdminJwtGuard
  @Put(':id')
  updateLocationById(
    @Body(CustomValidationPipe) updateLocationDto: UpdateLocationDto,
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException(
            Message.REQUEST.ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    id: number,
  ) {
    return this.locationService.updateLocationById(id, updateLocationDto);
  }

  @AdminJwtGuard
  @Delete(':id')
  deleteLocationById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException(
            Message.REQUEST.ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    id: number,
  ) {
    return this.locationService.deleteLocationById(id);
  }

  @AdminJwtGuard
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
    type: UploadLocationImageDto,
  })
  uploadLocationImage(
    @Query(
      'locationId',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException(
            Message.REQUEST.ID_ERROR,
            HttpStatus.BAD_REQUEST,
          );
        },
      }),
    )
    locationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.locationService.uploadLocationImage(+locationId, file);
  }
}
