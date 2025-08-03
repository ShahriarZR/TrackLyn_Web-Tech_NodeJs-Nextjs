import { IsNotEmpty, Matches } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty({ message: 'Password is required' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        {
            message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*), and be 8+ characters long'
        }
    )
    password: string;

    @IsNotEmpty({ message: 'Confirm password is required' })
    confirmPassword: string;
}
