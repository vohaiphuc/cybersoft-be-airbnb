import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsString, Length } from "class-validator";

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

const MessageValidation = {
    notEmpty: "Không được để trống",
    name: "Phải là string",
    email: "Dùng định dạng: example@domain.com",
    password: "Phải là string",
    passwordLength: "Tối thiểu 6 kí tự",
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
    @IsNotEmpty({ message: MessageValidation.notEmpty })
    password: string
}

export class SignUpDto {
    @ApiProperty({ type: String })
    @IsNotEmpty({ message: MessageValidation.notEmpty })
    @IsString({ message: MessageValidation.name })
    name: string

    @ApiProperty({ type: String })
    @IsEmail({}, { message: MessageValidation.email })
    email: string

    @ApiProperty({ type: String })
    @IsNotEmpty({ message: MessageValidation.notEmpty })
    @Length(6, Infinity, { message: MessageValidation.passwordLength })
    @IsString({ message: MessageValidation.password })
    password: string

    @ApiProperty({ type: String })
    @Length(8, 15, { message: MessageValidation.phoneLength })
    @IsNumberString({}, { message: MessageValidation.phone })
    phone: string

    @ApiProperty({ type: Date, example: new Date() })
    @IsDateString({ strict: true }, { message: MessageValidation.birth_day })
    birth_day: Date

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender, { message: MessageValidation.gender })
    gender: Gender
}