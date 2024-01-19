import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { I_Data_Token } from '../auth/dto/token-auth.dto';
import { CommentDto } from './dto/comment.dto';
import { User } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/decorators/jwt-guard.decorator';
import {
  CustomValidationPipe,
  CustomParseIntPipe,
} from 'src/pipes/validation.pipe';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';

@ApiTags('Comment')
@UseFilters(HttpExceptionFilter)
@Controller('api/binh-luan')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('')
  getCommentList() {
    return this.commentService.getCommentList();
  }

  @Get('/lay-binh-luan-theo-phong/:ma_phong')
  async getCommentListByUser(
    @Param('ma_phong', new CustomParseIntPipe('ma_phong')) ma_phong: number,
  ) {
    return this.commentService.getCommentListByRoom(ma_phong);
  }

  @JwtGuard
  @Post('')
  postNewComment(
    @User('data') data: I_Data_Token,
    @Body(CustomValidationPipe) dto: CommentDto,
  ) {
    const { email } = data;
    return this.commentService.postNewComment(dto, email);
  }

  @JwtGuard
  @Put(':id')
  updateComment(
    @User('data') data: I_Data_Token,
    @Param('id', new CustomParseIntPipe('id')) id: number,
    @Body(CustomValidationPipe) dto: CommentDto,
  ) {
    const { email } = data;
    return this.commentService.updateComment(id, dto, email);
  }

  @JwtGuard
  @Delete(':id')
  deleteComment(
    @User('data') data: I_Data_Token,
    @Param('id', new CustomParseIntPipe('id')) id: number,
  ) {
    const { email } = data;
    return this.commentService.deleteComment(id, email);
  }
}
