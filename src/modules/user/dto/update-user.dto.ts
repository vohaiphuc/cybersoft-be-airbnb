import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsISO8601, IsNumber, IsString } from "class-validator"
import { Role, SignUpDto } from "src/modules/auth/dto/auth.dto"
import { CreateUserDto } from "./create-user.dto"

const MessageValidation = {
    role: "Phải là Number",
}

export class UpdateUserDto extends CreateUserDto {
    @ApiProperty({ type: Number })
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 0,
    }, { message: MessageValidation.role })
    id: number
}