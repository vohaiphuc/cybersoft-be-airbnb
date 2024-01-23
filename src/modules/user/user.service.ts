import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import * as brcypt from 'bcrypt'
import { Role } from '../auth/dto/auth.dto';
import { USER_SELECTED_COLUMN } from 'src/common/const/prisma.const';

@Injectable()
export class UserService {
    constructor(
        private readonly authService: AuthService
    ) { }
    private prisma = new PrismaClient()

    async verifyUser(email: string) {
        if (!email) {
            throw new HttpException(Message.USER.NOT_FOUND, HttpStatus.BAD_REQUEST)
        }
        const user = await this.prisma.nguoi_dung.findFirst({
            where: { email }
        })
        if (!user) {
            throw new HttpException(Message.USER.NOT_FOUND, HttpStatus.BAD_REQUEST)
        }
        return user
    }

    async getAllUsers() {
        const userList = await this.prisma.nguoi_dung.findMany({
            select: USER_SELECTED_COLUMN,
        })
        return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, userList)
    }

    async createUser(body: CreateUserDto) {
        const { name, email, password, phone, birth_day, gender, role } = body
        return await this.authService.signUp(
            { name, email, password, phone, birth_day, gender },
            role
        )
    }

    async deleteUserById(id: number) {
        const user = await this.prisma.nguoi_dung.findUnique({
            where: { id }
        })
        if (!user) {
            throw new HttpException(Message.USER.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        await this.prisma.nguoi_dung.delete({
            where: { id }
        })
        return ResponseData(HttpStatus.OK, Message.USER.DELETE_SUCCESS, "")
    }

    async getAllUsersPagination(pageIndex: number, pageSize: number, name: string) {
        const users = await this.prisma.nguoi_dung.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            select: USER_SELECTED_COLUMN,
            skip: (pageIndex - 1) * pageSize,
            take: pageSize,
        })
        return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, users)
    }

    async getUserById(id: number) {
        const user = await this.prisma.nguoi_dung.findUnique({
            where: { id },
            select: USER_SELECTED_COLUMN
        })
        return ResponseData(200, Message.USER.SUCCESS, user)
    }

    async updateUserById(id: number, body: CreateUserDto, email: string) {
        const checkUser = await this.verifyUser(email)
        const checkUserRole = checkUser.role
        const { ADMIN, USER } = Role

        if (checkUserRole === USER && checkUser.id !== id) {
            throw new HttpException(Message.USER.UPDATE_INFO_FAIL_FORBIDDEN, HttpStatus.FORBIDDEN)
        }

        const newRole = checkUserRole === ADMIN ? body.role : checkUserRole

        await this.prisma.nguoi_dung.update({
            where: { id },
            data: {
                ...body,
                birth_day: new Date(body.birth_day),
                password: brcypt.hashSync(body.password, 10),
                role: newRole,
            }
        })
        return ResponseData(HttpStatus.OK, Message.USER.UPDATE_INFO_SUCCESS, "")
    }

    async getUsersByName(name: string) {
        const users = await this.prisma.nguoi_dung.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            select: USER_SELECTED_COLUMN,
        })
        return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, users)
    }
}