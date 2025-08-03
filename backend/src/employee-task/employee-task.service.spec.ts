import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeTaskService } from './employee-task.service';

describe('EmployeeTaskService', () => {
  let service: EmployeeTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmployeeTaskService],
    }).compile();

    service = module.get<EmployeeTaskService>(EmployeeTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
