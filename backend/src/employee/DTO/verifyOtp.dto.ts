import { IsEmail, IsNotEmpty } from "class-validator";

export class VerifyOtpDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;
    otp: string;
}
