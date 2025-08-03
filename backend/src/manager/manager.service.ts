import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entity/emp.entity';
import { Task } from 'src/entity/assignedTask.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ManagerService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly mailerService: MailerService,
  ) { }

  async createAndAssignTask(createTask) {
    const employee = await this.employeeRepository.findOne({
      where: { id: createTask.assigneeId },
    });

    if (!employee) {
      return "Cannot find the employee with this id";
    }

    const savedTask = await this.taskRepository.save(createTask);

    // Add record to employeeTask table if assigneeId is set
    if (createTask.assigneeId) {
      const employeeTask = this.employeeRepository.manager.create('EmployeeTask', {
        assignedTaskId: savedTask.id,
        employeeId: createTask.assigneeId,
        createdAt: new Date(),
        assignedAt: new Date(),
        priority: 'medium', // default priority, can be adjusted
      });
      await this.employeeRepository.manager.save(employeeTask);
    }

    await this.mailerService.sendTaskAssignmentEmail(employee.email, {
      name: employee.name,
      title: savedTask.title,
      description: savedTask.description,
      projectType: savedTask.projectType,
      status: savedTask.status,
      dueDate: savedTask.dueDate,
    });

    return savedTask;
  }


}