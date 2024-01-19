import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { Role, SignInDto, SignUpDto } from './dto/auth.dto';
import { CustomValidationPipe } from 'src/pipes/validation.pipe';
import { JwtGuard } from 'src/decorators/jwt-guard.decorator';
import { User } from 'src/decorators/user.decorator';
import { I_Data_Token } from './dto/token-auth.dto';

@ApiTags("Auth")
@Controller('/api/auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signin")
  @ApiBody({ type: SignInDto })
  signIn(
    @Body(CustomValidationPipe) body: SignInDto
  ) {
    const { email, password } = body
    return this.authService.signIn(email, password)
  }

  @Post("signup")
  signUp(
    @Body(CustomValidationPipe) body: SignUpDto
  ) {
    const role: Role = Role.USER
    return this.authService.signUp(body, role)
  }

  @JwtGuard
  @Get("refresh-token")
  refreshAccessToken(
    @User('data') data: I_Data_Token
  ) {
    return this.authService.refreshAccessToken(data.email, data.key)
  }
}