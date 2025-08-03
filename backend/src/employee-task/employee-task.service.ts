// employee-task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from 'src/entity/assignedTask.entity';
import { Employee } from 'src/entity/emp.entity';
import { EmployeeTask } from 'src/entity/employeeTask.entity';
import { EmployeeActivityLogService } from 'src/employeeactivitylog/employeeactivitylog.service';

@Injectable()
export class EmployeeTaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(EmployeeTask)
    private readonly employeeTaskRepository: Repository<EmployeeTask>,

    private employeeActivityLogService: EmployeeActivityLogService,
  ) { }

  async getAssignedTasks(employeeId: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
      relations: ['tasks'],
    });
    if (!employee) {
      return "Cannot find the employee with this id";
    } else {
      return employee.tasks;
    }
  }

  async getPendingTasks(employeeId: number) {
    const tasks = await this.taskRepository.find({
      where: {
        assignee: { id: employeeId },
        status: 'pending',
      },
    });
    return tasks;
  }

  async getCompletedTasks(employeeId: number) {
    const tasks = await this.taskRepository.find({
      where: {
        assignee: { id: employeeId },
        status: 'completed',
      },
    });

    const taskIds = tasks.map(task => task.id);

    const employeeTasks = await this.employeeTaskRepository.find({
      where: {
        employeeId: employeeId,
        assignedTaskId: taskIds.length > 0 ? In(taskIds) : In([0]), // prevent empty array error
      },
    });

    const employeeTaskMap = new Map<number, any>();
    employeeTasks.forEach(et => {
      employeeTaskMap.set(et.assignedTaskId, et);
    });

    const tasksWithDates = tasks.map(task => {
      const et = employeeTaskMap.get(task.id);
      return {
        ...task,
        startAt: et ? et.startAt : null,
        completedAt: et ? et.completedAt : null,
      };
    });

    return tasksWithDates;
  }

  async getInProgressTasks(employeeId: number) {
    const tasks = await this.taskRepository.find({
      where: {
        assignee: { id: employeeId },
        status: 'in_progress',
      },
    });
    return tasks;
  }

  async getOverdueTasks(employeeId: number) {
    const currentDate = new Date();
    const tasks = await this.taskRepository.createQueryBuilder('task')
      .where('task.assigneeId = :employeeId', { employeeId })
      .andWhere('task.dueDate < :currentDate', { currentDate })
      .andWhere('task.status != :completedStatus', { completedStatus: 'completed' })
      .getMany();
    return tasks;
  }

  async updateTaskStatus(
    employeeId,
    taskId,
    newStatus: 'pending' | 'in_progress' | 'completed'
  ) {
    const task = await this.taskRepository.findOne({
      where: {
        id: taskId,
        assignee: { id: employeeId }
      },
      relations: ['assignee'],
    });

    if (!task) {
      return 'Task not found or not assigned to you'
    }
    const validStatuses = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(newStatus)) {
      return 'Invalid status value';
    }

    task.status = newStatus;
    task.updatedAt = new Date();

    // Update startAt in EmployeeTask entity if status is in_progress
    if (newStatus === 'in_progress') {
      const employeeTask = await this.employeeTaskRepository.findOne({
        where: {
          assignedTaskId: taskId,
          employeeId: employeeId,
        },
      });
      if (employeeTask) {
        employeeTask.startAt = new Date();
        await this.employeeTaskRepository.save(employeeTask);
      }
    }

    // Update completedAt in EmployeeTask entity if status is completed
    if (newStatus === 'completed') {
      const employeeTask = await this.employeeTaskRepository.findOne({
        where: {
          assignedTaskId: taskId,
          employeeId: employeeId,
        },
      });
      if (employeeTask) {
        employeeTask.completedAt = new Date();
        await this.employeeTaskRepository.save(employeeTask);
      }
    }

    await this.taskRepository.save(task);
    await this.employeeActivityLogService.log(task.assignee.email, 'update_task_status', `Task ID ${task.id} status changed to ${newStatus}.`);
    return {
      message: 'Task status updated successfully',
      newStatus
    };
  }

  async filterTask(
    employeeId,
    projectType
  ) {

    const tasks = await this.taskRepository.find({
      where: {
        projectType: projectType,
        assignee: { id: employeeId },
      }
    });
    return { tasks };
  }

  async searchTask(
    employeeId,
    search,
  ) {
    const tasks = await this.taskRepository.findOne({
      where: {
        title: search,
        assignee: { id: employeeId },
      }
    });

    return { tasks };
  }


  async attachFilesToTask(
    taskId: number,
    employeeId: number,
    files: Express.Multer.File[],
  ) {
    if (!files || !Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided for upload');
    }

    const task = await this.taskRepository.findOne({
      where: { id: taskId, assigneeId: employeeId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    const fileNames = files.map((file) => file.filename);
    task.attachments = [...(task.attachments || []), ...fileNames];

    await this.taskRepository.save(task);

    return {
      message: 'Files uploaded successfully',
      files: fileNames,
      fileUrls: fileNames.map((name) => `/uploads/${name}`),
    };
  }

  async getMonthlyTaskCount(employeeId: number) {
    const result = await this.employeeTaskRepository.createQueryBuilder('employeeTask')
      .select("TO_CHAR(employeeTask.assignedAt, 'Mon YYYY')", 'month')
      .addSelect('COUNT(*)', 'tasks')
      .where('employeeTask.employeeId = :employeeId', { employeeId })
      .groupBy("TO_CHAR(employeeTask.assignedAt, 'Mon YYYY')")
      .orderBy("MIN(employeeTask.assignedAt)", 'ASC')
      .getRawMany();

    return result.map(row => ({
      month: row.month,
      tasks: parseInt(row.tasks, 10),
    }));
  }


  async getWeeklyTaskCount(employeeId: number) {
    const result = await this.employeeTaskRepository.createQueryBuilder('employeeTask')
      .select("TO_CHAR(employeeTask.assignedAt, 'IYYY-IW')", 'week')
      .addSelect('COUNT(*)', 'tasks')
      .where('employeeTask.employeeId = :employeeId', { employeeId })
      .groupBy("TO_CHAR(employeeTask.assignedAt, 'IYYY-IW')")
      .orderBy("MIN(employeeTask.assignedAt)", 'ASC')
      .getRawMany();

    return result.map(row => ({
      week: row.week,
      tasks: parseInt(row.tasks, 10),
    }));
  }


  async getSixMonthTaskCount(employeeId: number) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const result = await this.employeeTaskRepository.createQueryBuilder('employeeTask')
      .select("TO_CHAR(employeeTask.assignedAt, 'Mon YYYY')", 'month')
      .addSelect('COUNT(*)', 'tasks')
      .where('employeeTask.employeeId = :employeeId', { employeeId })
      .andWhere('employeeTask.assignedAt >= :sixMonthsAgo', { sixMonthsAgo })
      .groupBy("TO_CHAR(employeeTask.assignedAt, 'Mon YYYY')")
      .orderBy("MIN(employeeTask.assignedAt)", 'ASC')
      .getRawMany();

    return result.map(row => ({
      month: row.month,
      tasks: parseInt(row.tasks, 10),
    }));
  }

  async getInProgressTaskDates(employeeId) {
    const employeeTasks = await this.employeeTaskRepository.createQueryBuilder('employeeTask')
      .leftJoinAndSelect('employeeTask.assignedTask', 'task')
      .where('employeeTask.employeeId = :employeeId', { employeeId })
      .andWhere('task.status = :status', { status: 'in_progress' })
      .getMany();

    return employeeTasks.map(et => {
      const task = et.assignedTask;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        projectType: task.projectType,
        status: task.status,
        createdAt: task.createdAt ? task.createdAt.toISOString().split('T')[0] : null,
        updatedAt: task.updatedAt ? task.updatedAt.toISOString().split('T')[0] : null,
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : null,
        assigneeId: task.assigneeId,
        attachments: task.attachments,
        startAt: et.startAt ? et.startAt.toISOString().split('T')[0] : null,
        completedAt: et.completedAt ? et.completedAt.toISOString().split('T')[0] : null,
      };
    });
  }
}
