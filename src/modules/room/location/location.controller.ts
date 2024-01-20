import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { ApiBody, ApiConsumes, ApiTags, ApiQuery } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { CreateLocationDto } from './dto/create-location.dto';
import {
  CustomValidationPipe,
  CustomParseIntPipe,
} from 'src/pipes/validation.pipe';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UploadLocationImageDto } from './dto/upload-location-image.dto';
import { AdminJwtGuard } from 'src/decorators/jwt-guard.decorator';
import { UseUploadImage } from 'src/decorators/image.decorator';
import { CustomImageFilePipe } from '../../../pipes/validation.pipe';

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
  @ApiQuery({ name: 'keyword', required: false })
  getAllLocationsPagination(
    @Query('pageIndex', new CustomParseIntPipe('pageIndex'))
    pageIndex: number,
    @Query('pageSize', new CustomParseIntPipe('pageSize'))
    pageSize: number,
    @Query('keyword') keyword: string,
  ) {
    return this.locationService.getAllLocationsPagination(
      pageIndex,
      pageSize,
      keyword,
    );
  }

  @Get(':id')
  getLocationById(
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.locationService.getLocationById(id);
  }

  @AdminJwtGuard
  @Put(':id')
  updateLocationById(
    @Body(CustomValidationPipe) updateLocationDto: UpdateLocationDto,
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.locationService.updateLocationById(id, updateLocationDto);
  }

  @AdminJwtGuard
  @Delete(':id')
  deleteLocationById(
    @Param('id', new CustomParseIntPipe('id'))
    id: number,
  ) {
    return this.locationService.deleteLocationById(id);
  }

  @AdminJwtGuard
  @Post('/upload-image')
  @UseUploadImage('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadLocationImageDto,
  })
  uploadLocationImage(
    @Query('locationId', new CustomParseIntPipe('locationId'))
    locationId: number,
    @UploadedFile(new CustomImageFilePipe())
    file: Express.Multer.File,
  ) {
    return this.locationService.uploadLocationImage(locationId, file);
  }
}
