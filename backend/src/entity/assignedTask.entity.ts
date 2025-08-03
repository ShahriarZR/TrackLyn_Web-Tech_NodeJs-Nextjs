import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './emp.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column({ length: 100 })
    description: string;

    @Column({ length: 50 })
    projectType: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    })
    status: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;

    @Column({
        type: 'timestamp',
        nullable: false
    })
    dueDate: Date;

    @ManyToOne(() => Employee, (employee) => employee.tasks, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'assigneeId' })
    assignee: Employee;

    @Column({ nullable: true })
    assigneeId: number;

    @Column({ type: 'simple-array', nullable: true })
    attachments: string[];

}