import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsISO8601, IsString } from "class-validator";

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export class SignInDto {
    @ApiProperty({ type: String })
    email: string

    @ApiProperty({ type: String })
    password: string
}

const MessageValidation = {
    name: "Phải là string",
    email: "Phải là string",
    password: "Phải là string",
    phone: "Phải là string",
    birth_day: "Dùng định dạng ISO8601: 'YYYY-MM-DD' hoặc 'YYYY-MM-DDTHH:mm:ss.sssZ'",
    gender: "'MALE' | 'FEMALE'",
}

export class SignUpDto {
    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.name })
    name: string

    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.email })
    email: string

    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.password })
    password: string

    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.phone })
    phone: string

    @ApiProperty({ type: String, example: new Date() })
    @IsISO8601({ strict: true }, { message: MessageValidation.birth_day })
    birth_day: string

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender, { message: MessageValidation.gender })
    gender: Gender
}