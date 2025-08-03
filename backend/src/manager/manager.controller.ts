import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ManagerService } from './manager.service';

@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('tasks')
  async createTask(@Body() createTask) {
    return this.managerService.createAndAssignTask(createTask);
  }

}