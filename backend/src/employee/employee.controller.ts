import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Request } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ValidateEmployeeDto } from './DTO/validate.dto';
import { updateValidateEmployeeDto } from './DTO/updateValidate.dto';
import { ForgotPasswordDto } from './DTO/forgotPassword.dto';
import { VerifyOtpDto } from './DTO/verifyOtp.dto';
import { ChangePasswordDto } from './DTO/changePassword.dto';
import { ResendOtpDto } from './DTO/resend.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('employee')
export class EmployeeController {
    constructor(private readonly empService: EmployeeService) { }

    @Post('registration')
    saveEmployee(@Body() data: ValidateEmployeeDto) {
        return this.empService.saveEmployee(data);
    }

    @Post('verify-email')
    async verifyEmail(@Body() body) {
        return this.empService.verifyEmail(body.email, body.otp);
    }

    @Post('resend-otp')
    async resendOtp(@Body() body: ResendOtpDto) {
        return this.empService.resendOtp(body.email, body.type);
    }


    @Post('login')
    empLogin(@Body() data) {
        return this.empService.empLogin(data);
    }

    @Patch('dashboard/updateInfo')
    @UseGuards(JwtAuthGuard)
    updateEmpData(@Request() req, @Body() data: updateValidateEmployeeDto) {
        const employeeId = req.user.sub || req.user.id;
        return this.empService.updateEmpData(employeeId, data);
    }

    @Delete('dashboard/deleteAcc')
    @UseGuards(JwtAuthGuard)
    deleteEmpData(@Request() req) {
        const employeeId = req.user.sub || req.user.id;
        if (!employeeId) {
            throw new Error('Employee ID not found in token');
        }
        return this.empService.deleteEmpData(employeeId);
    }

    @Get('dashboard/accInfo')
    @UseGuards(JwtAuthGuard)
    getEmpData(@Request() req) {
        const employeeId = req.user.sub || req.user.id;
        return this.empService.getEmpData(employeeId);
    }

    @Post('forgot-password')
    forgotPassword(@Body() data: ForgotPasswordDto) {
        return this.empService.forgotPassword(data);
    }

    @Post('verify-otp')
    verifyOtp(@Body() data: VerifyOtpDto) {
        return this.empService.verifyOtp(data);
    }

    @Post('dashboard/change-password')
    @UseGuards(JwtAuthGuard)
    changePasswordAfterOtp(@Request() req, @Body() data: ChangePasswordDto) {
        const employeeId = req.user.sub || req.user.id;
        return this.empService.changePassword(employeeId, data);
    }

    @Post('google-login')
    async googleLogin(@Body('token') token: string) {
        return this.empService.handleGoogleLogin(token);
    }


}
