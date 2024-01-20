import { applyDecorators, createParamDecorator, ExecutionContext, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/auth.guard';
import { AdminJwtAuthGuard } from 'src/modules/user/user.guard';

export const JwtGuard = applyDecorators(
    ApiBearerAuth(), UseGuards(JwtAuthGuard)
)

export const AdminJwtGuard = applyDecorators(
    ApiBearerAuth(), UseGuards(AdminJwtAuthGuard)
)