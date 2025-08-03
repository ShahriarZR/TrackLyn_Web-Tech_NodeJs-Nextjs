import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeActivityLog } from 'src/entity/employeeActivityLog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeActivityLogService {
  constructor(
    @InjectRepository(EmployeeActivityLog)
    private readonly logRepo: Repository<EmployeeActivityLog>,
  ) {}

  async log(employeeEmail: string, action: string, description?: string) {
    const log = this.logRepo.create({ employeeEmail, action, description });
    await this.logRepo.save(log);
  }
}
