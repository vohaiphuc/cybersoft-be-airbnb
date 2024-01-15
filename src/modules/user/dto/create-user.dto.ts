import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsISO8601, IsString } from "class-validator"
import { Role, SignUpDto } from "src/modules/auth/dto/auth.dto"

const MessageValidation = {
    role: "'USER' | 'ADMIN'",
}

export class CreateUserDto extends SignUpDto {
    @ApiProperty({ enum: Role })
    @IsEnum(Role, { message: MessageValidation.role })
    role: Role
}