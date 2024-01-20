import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import * as brcypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Role, SignUpDto } from './dto/auth.dto';
import { I_Data_Token } from './dto/token-auth.dto';
import { USER_SELECTED_COLUMN } from 'src/common/const/prisma.const';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }
    private prisma = new PrismaClient()

    private createToken(data: I_Data_Token) {
        return this.jwtService.sign({ data }, {
            expiresIn: "3d",
            secret: this.configService.get("TOKEN_KEY")
        })
    }

    async refreshAccessToken(email: string, key: number) {
        if (!email || !key) {
            throw new HttpException(Message.TOKEN.FAIL, HttpStatus.BAD_REQUEST)
        }
        const user = await this.prisma.nguoi_dung.findFirst({
            where: { email }
        })
        const refreshToken = user.refresh_token
        const decodeRefreshToken = this.jwtService.decode(refreshToken)
        if (decodeRefreshToken.data.key !== key) {
            throw new HttpException(Message.TOKEN.FAIL_KEY, HttpStatus.BAD_REQUEST)
        }
        const newAccessToken = this.createToken({
            email,
            key
        })
        return ResponseData(HttpStatus.OK, Message.TOKEN.SUCCESS_REFRESH, { access_token: newAccessToken })
    }

    async signIn(email: string, password: string) {
        if (!email) { throw new HttpException(Message.LOGIN.EMAIL_FAIL, HttpStatus.BAD_REQUEST) }
        const user = await this.prisma.nguoi_dung.findFirst({
            where: { email }
        })
        if (!user) {
            throw new HttpException(Message.LOGIN.EMAIL_FAIL, HttpStatus.BAD_GATEWAY)
        }
        if (!brcypt.compareSync(password, user.password)) {
            throw new HttpException(Message.LOGIN.PW_FAIL, HttpStatus.BAD_GATEWAY)
        }
        const registeredUser = await this.prisma.nguoi_dung.findFirst({
            where: { email },
            select: USER_SELECTED_COLUMN
        })
        const decodeRefreshToken = this.jwtService.decode(user.refresh_token)
        const key = decodeRefreshToken.data.key
        const access_token = this.createToken({ email, key })
        const data = {
            access_token,
            user: registeredUser
        }
        return ResponseData(200, Message.LOGIN.SUCCESS, data)
    }

    async signUp(requestBody: SignUpDto, role: Role) {
        const { email, password, birth_day } = requestBody
        if (!email) {
            throw new HttpException(Message.LOGIN.EMAIL_FAIL, HttpStatus.BAD_REQUEST)
        }
        const user = await this.prisma.nguoi_dung.findFirst({
            where: { email }
        })
        if (user) {
            throw new HttpException(Message.REGISTER.EMAIL_FAIL, HttpStatus.BAD_REQUEST)
        }
        const key = Date.now()
        const refresh_token = this.jwtService.sign({
            data: { email, key },
        }, {
            expiresIn: "30d",
            privateKey: this.configService.get("TOKEN_KEY")
        })
        const newUser = {
            ...requestBody,
            password: brcypt.hashSync(password, 10),
            birth_day: new Date(birth_day),
            role,
            refresh_token,
        }
        await this.prisma.nguoi_dung.create({ data: newUser })
        const registeredUser = await this.prisma.nguoi_dung.findFirst({
            where: { email },
            select: USER_SELECTED_COLUMN
        })
        const access_token = this.createToken({ email, key })
        const data = {
            access_token,
            user: registeredUser,
        }
        return ResponseData(HttpStatus.OK, Message.REGISTER.SUCCESS, data)
    }
}
