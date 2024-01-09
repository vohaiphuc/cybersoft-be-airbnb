import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { LocationModule } from './location/location.module';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [LocationModule],
})
export class RoomModule { }
