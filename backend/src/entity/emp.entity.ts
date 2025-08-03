import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Task } from "./assignedTask.entity";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column({ nullable: true, length: 50 })
  jobTitle: string;

  @Column({ unique: true, length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  address: string;

  @Column({ select: false, length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  otp: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastOtpResend?: Date | null;


  @Column({ type: 'timestamp', nullable: true })
  otpExpiry: Date | null;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isOtpVerified: boolean;


  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

}