import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, nguoi_dung } from '@prisma/client';
import { Message } from 'src/common/const/message.const';
import { ResponseData } from 'src/common/util/response.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import * as brcypt from 'bcrypt'
import { Role } from '../auth/dto/auth.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birth_day: true,
                gender: true,
                role: true,
            },
            where: {}
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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birth_day: true,
                gender: true,
                role: true,
            }
        })
        if (!users) { return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, "") }
        const pageCount = Math.ceil(users.length / pageSize)
        if (pageIndex > pageCount) {
            throw new HttpException(Message.USER.FAIL_PAGEINDEX, HttpStatus.BAD_REQUEST)
        }
        const start = (pageIndex - 1) * pageSize
        const end = start + +pageSize
        const result = []
        for (var i = start; i < end; i++) {
            if (!users[i]) {
                break
            }
            result.push(users[i])
        }
        return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, result)
    }

    async getUserById(id: number) {
        const user = await this.prisma.nguoi_dung.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birth_day: true,
                gender: true,
                role: true,
            }
        })
        return ResponseData(200, Message.USER.SUCCESS, user)
    }

    async updateUserById(id: number, body: CreateUserDto, email: string) {
        const checkUser = await this.verifyUser(email)
        const checkUserRole = checkUser.role
        const { ADMIN, USER } = Role

        // USER role -> chỉ có thể cập nhật account của mình
        if (checkUserRole === USER && checkUser.id !== id) {
            throw new HttpException(Message.USER.UPDATE_INFO_FAIL_UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }

        // ADMIN role -> có thể thay đổi role
        // USER role  -> không thể thay đổi role
        const newRole = checkUserRole === ADMIN ? body.role : checkUserRole

        const { name, password, phone, birth_day, gender } = body
        await this.prisma.nguoi_dung.update({
            where: { id },
            data: {
                name, phone, birth_day, gender,
                password: brcypt.hashSync(password, 10),
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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                birth_day: true,
                gender: true,
                role: true,
            }
        })
        return ResponseData(HttpStatus.OK, Message.USER.SUCCESS, users)
    }

    async updateUserAvatar() { }
}