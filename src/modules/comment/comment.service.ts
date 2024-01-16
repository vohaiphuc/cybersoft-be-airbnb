import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';
import { ResponseData } from 'src/common/util/response.utils';
import { Message } from 'src/common/const/message.const';
import { UserService } from '../user/user.service';
import { Role } from '../auth/dto/auth.dto';

@Injectable()
export class CommentService {
  constructor(private readonly userService: UserService) {}
  private prisma = new PrismaClient();

  async getCommentList() {
    try {
      const commentList = await this.prisma.binh_luan.findMany({});
      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.LIST_ALL_SUCCESS,
        commentList,
      );
    } catch (error) {
      throw new Error(`${Message.COMMENT.FAIL} ${error.message}`);
    }
  }

  async postNewComment(dto: CommentDto, email: string) {
    try {
      const user = await this.userService.verifyUser(email);

      const comment = await this.prisma.binh_luan.create({
        data: { ...dto, ma_nguoi_binh_luan: user.id },
      });

      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.POST_COMMENT_SUCCESS,
        comment,
      );
    } catch (error) {
      throw new Error(`${Message.COMMENT.FAIL} ${error.message}`);
    }
  }

  async updateComment(id: number, dto: CommentDto, email: string) {
    try {
      const user = await this.userService.verifyUser(email);
      const userRole = user.role;
      const { ADMIN, USER } = Role;
      let oldComment = await this.prisma.binh_luan.findUnique({
        where: { id },
      });
      if (!oldComment) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.COMMENT.NOT_FOUND,
          null,
        );
      }

      if (userRole === USER && user.id !== oldComment.ma_nguoi_binh_luan) {
        return ResponseData(
          HttpStatus.UNAUTHORIZED,
          Message.COMMENT.UNAUTHORIZED,
          null,
        );
      }
      const comment = await this.prisma.binh_luan.update({
        where: { id },
        data: dto,
      });
      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.UPDATED_COMMENT_SUCCESS,
        comment,
      );
    } catch (error) {
      throw new Error(`${Message.COMMENT.FAIL} ${error.message}`);
    }
  }

  async deleteComment(id: number, email: string) {
    try {
      const checkUser = await this.userService.verifyUser(email);
      const checkUserRole = checkUser.role;
      const { ADMIN, USER } = Role;

      let comment = await this.prisma.binh_luan.findUnique({
        where: { id },
      });

      if (!comment) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.COMMENT.NOT_FOUND,
          null,
        );
      }

      if (
        checkUserRole === USER &&
        checkUser.id !== comment.ma_nguoi_binh_luan
      ) {
        return ResponseData(
          HttpStatus.UNAUTHORIZED,
          Message.COMMENT.UNAUTHORIZED,
          null,
        );
      }
      const deletedComment = await this.prisma.binh_luan.delete({
        where: { id },
      });
      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.DELETED_COMMENT_SUCCESS,
        deletedComment,
      );
    } catch (error) {
      throw new Error(`${Message.COMMENT.FAIL} ${error.message}`);
    }
  }

  async getCommentListByRoom(ma_phong: number) {
    try {
      const commentListByRoom = await this.prisma.binh_luan.findMany({
        where: { ma_phong },
      });
      if (commentListByRoom.length === 0) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.COMMENT.NOT_FOUND,
          null,
        );
      }
      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.GET_COMMENT_SUCCESS,
        commentListByRoom,
      );
    } catch (error) {
      throw new Error(`${Message.COMMENT.FAIL} ${error.message}`);
    }
  }
}
