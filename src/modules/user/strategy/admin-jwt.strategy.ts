import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, "jwt-admin") {
    constructor(
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("TOKEN_KEY"),
        });
    }
    private prisma = new PrismaClient()

    async validate(payload: any) {
        const email = payload.data.email
        if (!email) {
            throw new HttpException(Message.USER.NOT_FOUND, HttpStatus.BAD_REQUEST)
        }
        const user = await this.prisma.nguoi_dung.findFirst({
            where: { email }
        })
        if (!user) {
            throw new HttpException(Message.USER.NOT_FOUND, HttpStatus.BAD_REQUEST)
        }
        if (user.role !== 'ADMIN') {
            throw new HttpException(Message.USER.FORBIDDEN, HttpStatus.FORBIDDEN)
        }
        return payload
    }
}