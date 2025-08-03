import { IsEmail, IsIn } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  email: string;
  @IsIn(['email_verification', 'password_reset'])
    type: 'email_verification' | 'password_reset';
}
