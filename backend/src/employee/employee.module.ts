import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { Employee } from '../entity/emp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Task } from '../entity/assignedTask.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { EmployeeActivityLogModule } from 'src/employeeactivitylog/employeeactivitylog.module';
import { MulterModule } from '@nestjs/platform-express';


@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Task]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretkey123',
      signOptions: { expiresIn: '1h' },
    }),
    MulterModule.register({
      dest: './uploads', // or customize further
    }),
    EmployeeActivityLogModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtStrategy, MailerService]
})
export class EmployeeModule { }
