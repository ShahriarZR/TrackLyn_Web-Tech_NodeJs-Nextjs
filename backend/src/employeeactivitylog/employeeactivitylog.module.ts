import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeActivityLog } from 'src/entity/employeeActivityLog.entity';
import { EmployeeActivityLogService } from './employeeactivitylog.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeActivityLog])],
  providers: [EmployeeActivityLogService],
  exports: [EmployeeActivityLogService] // Important: make it available to other modules
})
export class EmployeeActivityLogModule {}
