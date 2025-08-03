import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeTaskController } from './employee-task.controller';

describe('EmployeeTaskController', () => {
  let controller: EmployeeTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeTaskController],
    }).compile();

    controller = module.get<EmployeeTaskController>(EmployeeTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
