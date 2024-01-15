import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { BookingModule } from './modules/booking/booking.module';

@Module({
  imports: [AuthModule, UserModule, CommentModule, BookingModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
