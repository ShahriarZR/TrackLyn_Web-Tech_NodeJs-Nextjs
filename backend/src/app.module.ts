import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entity/emp.entity';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { Task } from './entity/assignedTask.entity';
import { ManagerModule } from './manager/manager.module';
import { MailerService } from './mailer/mailer.service';
import { ScheduleModule } from '@nestjs/schedule';
import { EmployeeActivityLog } from './entity/employeeActivityLog.entity';
import { EmployeeActivityLogModule } from './employeeactivitylog/employeeactivitylog.module';
import { EmployeeTaskService } from './employee-task/employee-task.service';
import { EmployeeTaskController } from './employee-task/employee-task.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmployeeTask } from './entity/employeeTask.entity';

@Module({
  imports: [
    EmployeeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'task_management',
      entities: [Employee, Task, EmployeeActivityLog, EmployeeTask],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task, Employee, EmployeeTask]),
    AuthModule,
    ManagerModule,
    ScheduleModule.forRoot(),
    EmployeeActivityLogModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, EmployeeTaskController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    MailerService,
    EmployeeTaskService,
  ],
})
export class AppModule {}
