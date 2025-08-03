import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { Employee } from '../entity/emp.entity';
import { Task } from 'src/entity/assignedTask.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Employee])],
  controllers: [ManagerController],
  providers: [ManagerService, MailerService],
})
export class ManagerModule {}