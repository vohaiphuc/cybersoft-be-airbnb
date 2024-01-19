import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsISO8601, IsNumberString, IsString, Length } from "class-validator";

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

const MessageValidation = {
    name: "Phải là string",
    email: "Dùng định dạng: example@domain.com",
    password: "Phải là string",
    phone: "Phải là number string",
    phoneLength: "Tối thiểu 8 chữ số, tối đa 15 chữ số",
    birth_day: "Dùng định dạng ISO8601: 'YYYY-MM-DD' hoặc 'YYYY-MM-DDTHH:mm:ss.sssZ'",
    gender: "'MALE' | 'FEMALE'",
}

export class SignInDto {
    @ApiProperty({ type: String })
    @IsEmail({}, { message: MessageValidation.email })
    email: string

    @ApiProperty({ type: String })
    password: string
}

export class SignUpDto {
    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.name })
    name: string

    @ApiProperty({ type: String })
    @IsEmail({}, { message: MessageValidation.email })
    email: string

    @ApiProperty({ type: String })
    @IsString({ message: MessageValidation.password })
    password: string

    @ApiProperty({ type: String })
    @Length(8, 15, { message: MessageValidation.phoneLength })
    @IsNumberString({}, { message: MessageValidation.phone })
    phone: string

    @ApiProperty({ type: String, example: new Date() })
    @IsISO8601({ strict: true }, { message: MessageValidation.birth_day })
    birth_day: string

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender, { message: MessageValidation.gender })
    gender: Gender
}