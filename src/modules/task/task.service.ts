import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task-status.enum';

export interface PaginatedTaskResponse {
  rows: Task[];
  page: number;
  total: number;
}

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description ?? null,
      status: createTaskDto.status ?? TaskStatus.TODO,
      ownerId: createTaskDto.ownerId,
    });

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByOwner(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<PaginatedTaskResponse> {
    const offset = (page - 1) * limit;
    
    const [rows, total] = await this.taskRepository.findAndCount({
      where: [
        {
          ownerId,
          title: ILike(`%${search}%`),
        },
        {
          ownerId,
          description: ILike(`%${search}%`),
        },
      ],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      rows,
      page,
      total,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<PaginatedTaskResponse> {
    const offset = (page - 1) * limit;
    
    const [rows, total] = await this.taskRepository.findAndCount({
      where: [
        { title: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return {
      rows,
      page,
      total,
    };
  }

  async findByTitleAndOwner(title: string, ownerId: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { title, ownerId },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);
    
    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async remove(ids: string[]): Promise<boolean> {
    const result = await this.taskRepository.delete(ids);
    return (result.affected ?? 0) > 0;
  }
}
