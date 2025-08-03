import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class EmployeeActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  employeeEmail: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  timestamp: Date;
}
