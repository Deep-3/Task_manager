import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './task.dto';
import { UpdateTaskDto } from './task.dto';
import { AuthRequest } from 'src/auth/auth.interface';
import { UserService } from '../user/user.service';
import { TaskPagination } from './task.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  async create(createTaskDto: CreateTaskDto, req: AuthRequest): Promise<Task> {
    await this.userService.findById(req.user.id);

    const task = this.taskRepository.create({
      title: createTaskDto.title,
      description: createTaskDto.description ?? null,
      status: createTaskDto.status,
      ownerId: req.user.id,
    });

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(
        `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async findByOwner(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<TaskPagination> {
    const offset = (page - 1) * limit;

    const [rows] = await this.taskRepository.findAndCount({
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
      total: rows.length,
    };
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search: string = '',
  ): Promise<TaskPagination> {
    const offset = (page - 1) * limit;

    const [rows] = await this.taskRepository.findAndCount({
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
      total: rows.length,
    };
  }

  async findByTitleAndOwner(
    title: string,
    ownerId: string,
  ): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { title, ownerId },
    });
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['owner'],
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          id: true,
          email: true,
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }


    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, updateTaskDto);

    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      throw new Error(
        `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async remove(ids: string[]): Promise<boolean> {
    const result = await this.taskRepository.delete(ids);
    return (result.affected ?? 0) > 0;
  }
}
