import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { UpdateTaskDto } from './task.dto';
import { AuthRequest } from 'src/auth/auth.interface';
import { TaskPagination } from './task.type';
import { TaskMessage } from './task.constant';
import { pagination } from '../../common/app.contant';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, req: AuthRequest): Promise<Task> {
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description ?? null,
      status: createTaskDto.status,
      ownerId: req.user.id,
    });

    return await this.taskRepository.save(task);
  }

  async findByOwner(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<TaskPagination> {
    const offset = pagination(page, limit);
    const [tasks, total] = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.ownerId = :ownerId', { ownerId })
      .andWhere('task.title ILIKE :search', { search: `%${search}%` })
      .andWhere('task.description ILIKE :search', { search: `%${search}%` })
      .skip(offset)
      .take(limit)
      .orderBy('task.createdAt', 'DESC')
      .getManyAndCount();

    return {
      tasks,
      page,
      total,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<TaskPagination> {
    const offset = pagination(page, limit);

    const [tasks, total] = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.title ILIKE :search', { search: `%${search}%` })
      .andWhere('task.description ILIKE :search', { search: `%${search}%` })
      .skip(offset)
      .take(limit)
      .orderBy('task.createdAt', 'DESC')
      .getManyAndCount();

    return {
      tasks,
      page,
      total,
    };
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.owner', 'owner')
      .select([
        'task.id',
        'task.title',
        'task.description',
        'task.status',
        'task.createdAt',
        'task.updatedAt',
        'owner.id',
        'owner.email',
      ])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new NotFoundException(TaskMessage.Error.TASK_NOT_FOUND);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .where('task.id = :id', { id })
      .andWhere('task.deletedAt = false')
      .getOne();

    if (!task) {
      throw new NotFoundException(TaskMessage.Error.TASK_NOT_FOUND);
    }

    Object.assign(task, updateTaskDto);

    return this.taskRepository.save(task);
  }

  async remove(ids: string[]): Promise<boolean> {
    const result = await this.taskRepository.update(
      { id: In(ids) },
      { deletedAt: new Date() },
    );
    return (result.affected ?? 0) > 0;
  }
}
