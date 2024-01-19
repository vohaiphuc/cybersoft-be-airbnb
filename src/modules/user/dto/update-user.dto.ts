import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"
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