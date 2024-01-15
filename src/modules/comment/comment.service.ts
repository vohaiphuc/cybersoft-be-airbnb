import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';
import { ResponseData } from 'src/common/util/response.utils';
import { Message } from 'src/common/const/message.const';

@Injectable()
export class CommentService {
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

  async postNewComment(dto: CommentDto) {
    try {
      const comment = await this.prisma.binh_luan.create({
        data: dto,
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

  async updateComment(id: number, dto: CommentDto) {
    try {
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

  async deleteComment(id: number) {
    try {
      let checkAvailable = await this.prisma.binh_luan.findUnique({
        where: { id },
      });
      if (!checkAvailable) {
        return ResponseData(
          HttpStatus.NOT_FOUND,
          Message.COMMENT.NOT_FOUND,
          null,
        );
      }
      const comment = await this.prisma.binh_luan.delete({
        where: { id },
      });
      return ResponseData(
        HttpStatus.OK,
        Message.COMMENT.DELETED_COMMENT_SUCCESS,
        comment,
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
