import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeActivityLogService } from './employeeactivitylog.service';

describe('EmployeeactivitylogService', () => {
  let service: EmployeeActivityLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeActivityLogService],
    }).compile();

    service = module.get<EmployeeActivityLogService>(EmployeeActivityLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
