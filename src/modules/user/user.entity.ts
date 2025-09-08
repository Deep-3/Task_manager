import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserRole } from './user.type';
import { Task } from '../task/task.entity';
import { ulid } from 'ulid';
@Entity('users')
@Index(['email'], { unique: true })
@Index(['role'])
@Index(['createdAt'])
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.owner)
  tasks: Task[];

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  beforeInsert() {
    this.id = ulid();
  }
}
