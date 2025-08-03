import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Task } from './assignedTask.entity';
import { Employee } from './emp.entity';

export enum Priority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@Entity()
export class EmployeeTask {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Task, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'assignedTaskId' })
    assignedTask: Task;

    @Column()
    assignedTaskId: number;

    @ManyToOne(() => Employee, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column()
    employeeId: number;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    assignedAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    startAt: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    completedAt: Date;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.LOW,
    })
    priority: Priority;
}
