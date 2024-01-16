import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { RoomModule } from './modules/room/room.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { BookingModule } from './modules/booking/booking.module';
import { JwtStrategy } from './modules/auth/strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { AdminJwtStrategy } from './modules/user/strategy/admin-jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, UserModule, CommentModule, BookingModule, RoomModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [JwtService, JwtStrategy, AdminJwtStrategy],
})
export class AppModule {}
