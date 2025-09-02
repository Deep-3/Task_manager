import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeInsert,
} from 'typeorm';
import { TaskStatus } from './task.type';
import { User } from '../user/user.entity';
import { ulid } from 'ulid';
@Entity('tasks')
@Index(['ownerId', 'title'], { unique: true })
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @Column('ulid')
  ownerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @BeforeInsert()
  beforeInsert() {
    this.id = ulid();
  }

 
}
