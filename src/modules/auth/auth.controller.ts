import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/filters/http-exception.fitler';
import { Role, SignInDto, SignUpDto } from './dto/auth.dto';
import { CustomValidationPipe } from 'src/pipes/validation.pipe';

@ApiTags("Auth")
@Controller('/api/auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signin")
  @ApiBody({ type: SignInDto })
  signIn(
    @Body() body: SignInDto
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
}