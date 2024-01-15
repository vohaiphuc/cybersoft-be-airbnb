import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CommentDto } from './dto/comment.dto';
@Injectable()
export class CommentService {
  private prisma = new PrismaClient();

  async getCommentList() {
    const commentList = await this.prisma.binh_luan.findMany({});
    return {
      message: 'All comment loaded successful',
      data: { commentList },
    };
  }

  async postNewComment(dto: CommentDto) {
    const comment = await this.prisma.binh_luan.create({
      data: dto,
    });
    return {
      message: 'New comment created successfully',
      data: { comment },
    };
  }

  async updateComment(id: number, dto: CommentDto) {
    const comment = await this.prisma.binh_luan.update({
      where: {
        id,
      },
      data: dto,
    });
    return {
      message: 'Comment updated successful',
      data: { comment },
    };
  }

  async deleteComment(id: number) {
    let checkAvailable = await this.prisma.binh_luan.findUnique({
      where: { id },
    });
    if (!checkAvailable)
      throw new ForbiddenException('No comment match your request');
    const comment = await this.prisma.binh_luan.delete({
      where: {
        id,
      },
    });
    return {
      message: 'Delete comment successful',
      data: { comment },
    };
  }

  async getCommentListByRoom(ma_phong: number) {
    const commentListByRoom = await this.prisma.binh_luan.findMany({
      where: { ma_phong },
    });
    if (commentListByRoom.length === 0)
      throw new ForbiddenException('No booking Schedule match your request');
    return {
      message: 'All Comment List By Room loaded successful',
      data: { commentListByRoom },
      ma_phong,
    };
  }
}
