import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put, Query, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard, JwtGuard } from 'src/decorators/jwt-guard.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { CustomValidationPipe } from 'src/pipes/validation.pipe';
import { I_Data_Token } from '../auth/dto/token-auth.dto';

@ApiTags("User")
@Controller('/api/users')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @AdminJwtGuard
  @Get("")
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @AdminJwtGuard
  @Post("")
  createUser(
    @Body(CustomValidationPipe) body: CreateUserDto
  ) {
    return this.userService.createUser(body)
  }

  @AdminJwtGuard
  @Delete(":id")
  deleteUserById(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.deleteUserById(id)
  }

  @AdminJwtGuard
  @Get("phan-trang-tim-kiem")
  getAllUsersPagination(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
    @Query('TenNguoiDung') name: string,
  ) {
    return this.userService.getAllUsersPagination(pageIndex, pageSize, name)
  }

  @AdminJwtGuard
  @Get(":id")
  getUserById(
    @Param('id', new ParseIntPipe({ exceptionFactory: () => { throw new HttpException("ID không hợp lệ", 404) } })) id: number
  ) {
    return this.userService.getUserById(id)
  }

  @JwtGuard
  @Put(":id")
  updateUserById(
    @User('data') data: I_Data_Token,
    @Body(CustomValidationPipe) body: CreateUserDto,
    @Param('id', new ParseIntPipe({ exceptionFactory: () => { throw new HttpException("ID không hợp lệ", 404) } })) id: number
  ) {
    const { email } = data
    return this.userService.updateUserById(id, body, email)
  }

  @JwtGuard
  @Get("search/:TenNguoiDung")
  getUsersByName(
    @Param('TenNguoiDung') name: string
  ) {
    return this.userService.getUsersByName(name)
  }
}
