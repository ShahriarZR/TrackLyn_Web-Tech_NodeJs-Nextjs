import { IsAlpha, IsEmail, IsNotEmpty, IsNumberString, IsOptional, Matches, MinLength } from "class-validator";

export class updateValidateEmployeeDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Name is required' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name should contain only alphabets and spaces' })
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail({}, { message: 'Email is not valid' })
    email: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Phone number is required' })
    @Matches(/01[3-9]\d{8}$/, { message: 'Enter a valid phone number' })
    phone: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @IsOptional()
    @IsNotEmpty({ message: 'Password is required' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
        {
            message: 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*), and be 8+ characters long'
        }
    )
    password: string;
}