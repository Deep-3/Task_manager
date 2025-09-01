import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  controllers: [TaskController],
  providers: [TaskService, UserService],
  exports: [TaskService],
})
export class TaskModule {}
