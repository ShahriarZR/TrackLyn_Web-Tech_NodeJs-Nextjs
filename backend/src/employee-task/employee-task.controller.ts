import {
  Controller, Post, UseGuards, UseInterceptors,
  UploadedFiles, Body, Request,
  Get,
  Param,
  Patch,
  Res
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EmployeeTaskService } from './employee-task.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];

@Controller('employee/tasks')
export class EmployeeTaskController {
  constructor(private readonly taskService: EmployeeTaskService) { }

  @Get('assignedTasks')
  @UseGuards(JwtAuthGuard)
  getAssignedTasks(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getAssignedTasks(employeeId);
  }

  @Get('taskDates')
  @UseGuards(JwtAuthGuard)
  getTaskDates(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getInProgressTaskDates(employeeId);
  }

  @Get('pendingTasks')
  @UseGuards(JwtAuthGuard)
  getPendingTasks(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getPendingTasks(employeeId);
  }

  @Get('completedTasks')
  @UseGuards(JwtAuthGuard)
  getCompletedTasks(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getCompletedTasks(employeeId);
  }

  @Get('inProgressTasks')
  @UseGuards(JwtAuthGuard)
  getInProgressTasks(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getInProgressTasks(employeeId);
  }

  @Get('monthlyTaskCount')
  @UseGuards(JwtAuthGuard)
  getMonthlyTaskCount(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getMonthlyTaskCount(employeeId);
  }

  @Get('weeklyTaskCount')
  @UseGuards(JwtAuthGuard)
  getWeeklyTaskCount(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getWeeklyTaskCount(employeeId);
  }

  @Get('sixMonthTaskCount')
  @UseGuards(JwtAuthGuard)
  getSixMonthTaskCount(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getSixMonthTaskCount(employeeId);
  }

  @Get('overdueTasks')
  @UseGuards(JwtAuthGuard)
  getOverdueTasks(@Request() req) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.getOverdueTasks(employeeId);
  }

  @Get('download/:fileName')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Param('fileName') fileName: string, @Request() req, @Res() res) {
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    const filePath = path.join(uploadsDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Optionally, add authorization logic here to check if the user can access the file

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @Post('updateStatus/:taskId')
  @UseGuards(JwtAuthGuard)
  updateTaskStatus(
    @Param('taskId') taskId,
    @Body('status') newStatus,
    @Request() req,
  ) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.updateTaskStatus(
      employeeId,
      taskId,
      newStatus
    );
  }

  @Post('filter')
  @UseGuards(JwtAuthGuard)
  filterTask(
    @Body('projectType') projectType,
    @Request() req,
  ) {
    const employeeId = req.user.sub || req.user.id;
    return this.taskService.filterTask(
      employeeId,
      projectType
    );
  }

  @Post('search')
  @UseGuards(JwtAuthGuard)
  searchTask(
    @Body('title') search,
    @Request() req,
  ) {
    const employeeId = req.user.sub || req.user.id;

    return this.taskService.searchTask(
      employeeId,
      search
    );
  }

  @Post('uploadAttachments')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Only PDF, PNG, and JPG files are allowed'), false);
        }
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 5MB max per file
      },
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
    @Body('taskId') taskId: number,
  ) {
    const employeeId = req.user.id;
    return this.taskService.attachFilesToTask(taskId, employeeId, files);
  }
}
