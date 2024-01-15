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
import { JwtGuard } from 'src/decorators/jwt-guard.decorator';
import { User } from 'src/decorators/user.decorator';
import { I_Data_Token } from '../auth/dto/token-auth.dto';

@ApiTags('Comment')
@Controller('api/binh-luan')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('')
  getCommentList() {
    return this.commentService.getCommentList();
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

  @JwtGuard
  @Post('')
  postNewComment(@User('data') data: I_Data_Token, @Body() dto: CommentDto) {
    const { email } = data;
    return this.commentService.postNewComment(dto, email);
  }

  @JwtGuard
  @Put(':id')
  updateComment(
    @User('data') data: I_Data_Token,
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
    const { email } = data;
    return this.commentService.updateComment(id, dto, email);
  }

  @JwtGuard
  @Delete(':id')
  deleteComment(
    @User('data') data: I_Data_Token,
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
    const { email } = data;
    return this.commentService.deleteComment(id, email);
  }
}
