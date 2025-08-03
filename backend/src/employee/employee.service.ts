import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entity/emp.entity';
import { LessThan, Repository } from 'typeorm';
import { Task } from '../entity/assignedTask.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { VerifyOtpDto } from './DTO/verifyOtp.dto';
import { ForgotPasswordDto } from './DTO/forgotPassword.dto';
import { ChangePasswordDto } from './DTO/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmployeeActivityLogService } from 'src/employeeactivitylog/employeeactivitylog.service';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class EmployeeService {
  private client: OAuth2Client;

  constructor(
    @InjectRepository(Employee) private myRepo: Repository<Employee>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    private jwtService: JwtService, 
    private mailerService: MailerService, 
    private employeeActivityLogService: EmployeeActivityLogService,
  ) {
    this.client = new OAuth2Client('920376655470-gq4b4ml454qgk3bas159ecl9vut7ptet.apps.googleusercontent.com');
  }

  async saveEmployee(data) {
    // Check if email already exists
    const existingEmail = await this.myRepo.findOne({ where: { email: data.email } });
    if (existingEmail) {
      return 'Email already exists';
    }

    // Check if phone already exists
    const existingPhone = await this.myRepo.findOne({ where: { phone: data.phone } });
    if (existingPhone) {
      return 'Phone number already exists';
    }

    const now = new Date();
    const otp = require('otp-generator')
      .generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);

    const employee = this.myRepo.create({
      ...data,
      lastOtpResend: now,
      otp,
      otpExpiry: expiry
    });

    await this.myRepo.save(employee);
    await this.mailerService.sendOtpEmail(data.email, otp);
    await this.employeeActivityLogService.log(data.email, 'register', 'User registered and OTP sent.');


    return 'OTP sent to your email. Please verify to complete registration.';
  }

  // Runs every 10 minutes
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleExpiredOtpCleanup() {
    const now = new Date();
    const expiredUnverifiedEmployees = await this.myRepo.find({
      where: {
        isEmailVerified: false,
        otpExpiry: LessThan(now),
      },
    });

    if (expiredUnverifiedEmployees.length > 0) {
      const idsToDelete = expiredUnverifiedEmployees.map((employee) => employee.id);
      await this.myRepo.delete(idsToDelete);
      console.log(`Deleted ${idsToDelete.length} unverified employees with expired OTP.`);
    }
  }

  async verifyEmail(email: string, otp: string) {
    const employee = await this.myRepo.findOne({ where: { email } });

    if (!employee) return 'User not found';
    if (employee.isEmailVerified) return 'Email already verified';
    if (!employee.otp || !employee.otpExpiry || new Date() > employee.otpExpiry) {
      return 'OTP expired';
    }
    if (employee.otp !== otp) return 'Incorrect OTP';

    employee.isEmailVerified = true;
    employee.lastOtpResend = null;
    employee.otp = null;
    employee.otpExpiry = null;

    await this.myRepo.save(employee);
    await this.employeeActivityLogService.log(email, 'verify_email', 'Email verified successfully.');

    return 'Email verified successfully';
  }

  async resendOtp(email: string, type: 'email_verification' | 'password_reset') {
    const employee = await this.myRepo.findOne({ where: { email } });

    if (!employee) return 'Employee not found';

    if (employee.otp === null) {
      return 'No OTP has been generated for this account. Please complete registration or request a new OTP.';
    }

    const now = new Date();
    if (employee.lastOtpResend && (now.getTime() - employee.lastOtpResend.getTime()) < 2 * 60 * 1000) {
      return 'Please wait at least 2 minutes before requesting another OTP.';
    }

    const otp = require('otp-generator').generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    const expiry = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    employee.otp = otp;
    employee.otpExpiry = expiry;
    employee.lastOtpResend = now;

    if (type === 'email_verification') {
      if (employee.isEmailVerified) return 'Email already verified';
      await this.mailerService.sendOtpEmail(email, otp);
    } else if (type === 'password_reset') {
      if (employee.isOtpVerified) return 'OTP already verified for password reset';
      await this.mailerService.sendOtpEmail(email, otp);
    } else {
      return 'Invalid OTP type';
    }

    await this.myRepo.save(employee);
    return 'A new OTP has been sent to your email.';
  }

  async empLogin(data) {
    const employee = await this.myRepo.findOne({
      where: { email: data.email },
      select: ['id', 'name', 'email', 'jobTitle', 'phone', 'address', 'password', 'isEmailVerified'],
    });

    if (!employee) {
      return { error: "Invalid Username" };
    }
    const isMatch = await bcrypt.compare(data.password, employee.password);
    if (!isMatch) {
      return { error: "Wrong Password" };
    }
    if (!employee.isEmailVerified) {
      return { error: 'Please verify your email before logging in' };
    }
    else {
      const payload = {
        email: employee.email,
        sub: employee.id,
        name: employee.name
      };
      await this.employeeActivityLogService.log(employee.email, 'login', 'User logged in.');
      return {
        access_token: this.jwtService.sign(payload),
        message: employee.name + " logged in successfully",

      };
    }
  }

  async getEmpData(id) {
    const employee = await this.myRepo.findOne({ where: { id } })
    if (!employee) {
      return "No employee found";
    }
    else {
      return employee;
    }
  }

  async updateEmpData(id, data) {
    const employee = await this.myRepo.findOne({ where: { id } })
    if (!employee) {
      return "Cannot find the employee with this id"
    }
    else {
      const changes = Object.entries(data)
        .filter(([key, value]) => value !== undefined && employee[key] !== value)
        .map(([key, value]) => `${key}: '${employee[key]}' → '${value}'`)
        .join(', ');

      const updateEmployee = Object.assign(employee, data)
      await this.myRepo.save(updateEmployee)
      if (changes) {
        await this.employeeActivityLogService.log(
          employee.email,
          'update_profile',
          `Updated fields - ${changes}`
        );
      }
      return "Updated Employee Data"
    }
  }
  async deleteEmpData(id) {
    if (!id) {
      throw new Error('Invalid employee ID');
    }
    const employee = await this.myRepo.findOne({ where: { id } })
    if (!employee) {
      return "Cannot find the employee with this id"
    }
    else {
      await this.myRepo.delete({ id });
      return "Deleted Employee Data";
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const now = new Date();
    const employee = await this.myRepo.findOne({ where: { email: data.email } });
    if (!employee) return 'Employee not found';

    const otp = require('otp-generator')
      .generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    const expiry = new Date(Date.now() + 10 * 60000);

    employee.lastOtpResend = now;
    employee.otp = otp;
    employee.otpExpiry = expiry;
    await this.myRepo.save(employee);

    await this.mailerService.sendOtpEmail(data.email, otp);

    return 'OTP sent to your email';
  }

  async verifyOtp(data: VerifyOtpDto) {
    const employee = await this.myRepo.findOne({ where: { email: data.email } });
    if (!employee) return 'Employee not found';

    if (!employee.otp || employee.otp !== data.otp) return 'Invalid OTP';
    if (!employee.otpExpiry || new Date() > employee.otpExpiry) {
      return 'OTP expired';
    }

    employee.isOtpVerified = true;
    await this.myRepo.save(employee);

    return 'OTP verified. You can now change your password.';
  }

  async changePassword(id, data) {
    
    const employee = await this.myRepo.findOne({ where: { id }, select: ['id', 'password', 'email'] });
    
    if (!employee) return 'Employee not found';

    if (!data.password) {
      return 'Password is required';
    }
    
    if (!employee.password) {
      return 'Current password not set, cannot compare';
    }

    // Check if password and confirmPassword match
    if (data.password !== data.confirmPassword) {
      return 'Password and confirm password do not match';
    }

    // Check if new password is different from old password
    const isSamePassword = await bcrypt.compare(data.password, employee.password);
    if (isSamePassword) {
      return 'New password must be different from the old password';
    }

    const salt = await bcrypt.genSalt();
    employee.password = await bcrypt.hash(data.password, salt);
    
    await this.myRepo.save(employee);
    await this.employeeActivityLogService.log(employee.email, 'change_password', 'Password changed successfully after OTP verification.');
    return 'Password changed successfully';
  }

  async handleGoogleLogin(token: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: '920376655470-gq4b4ml454qgk3bas159ecl9vut7ptet.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }
    const email = payload.email;
    const name = payload.name;

    let employee = await this.myRepo.findOne({ where: { email } });

    if (!employee) {
      employee = this.myRepo.create({ email, name });
      employee.isEmailVerified = true;
      await this.myRepo.save(employee);
    }

    const jwtPayload = { id: employee.id, name: employee.name, email: employee.email };
    const access_token = await this.jwtService.signAsync(jwtPayload);

    return {
      message: 'Google login successful',
      access_token,
    };
  }

}
