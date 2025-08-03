import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;
}
