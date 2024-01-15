import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@Controller('api/binh-luan')
export class CommentController {
  constructor(private commentService: CommentService) {}
  @Get('')
  getCommentList() {
    return this.commentService.getCommentList();
  }

  @Post('')
  postNewComment(@Body() dto: CommentDto) {
    return this.commentService.postNewComment(dto);
  }

  @Put(':id')
  updateComment(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
    @Body() dto: CommentDto,
  ) {
    return this.commentService.updateComment(id, dto);
  }

  @Delete(':id')
  deleteComment(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    id: number,
    @Body() dto: CommentDto,
  ) {
    return this.commentService.deleteComment(id);
  }

  @Get('/lay-binh-luan-theo-phong/:ma_phong')
  async getCommentListByUser(
    @Param(
      'ma_phong',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new HttpException('ID không hợp lệ', 404);
        },
      }),
    )
    ma_phong: number,
  ) {
    return this.commentService.getCommentListByRoom(ma_phong);
  }
}
