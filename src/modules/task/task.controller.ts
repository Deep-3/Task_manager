import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto,UpdateTaskDto } from './task.dto';
import type{ AuthRequest } from '../../auth/auth.interface';
@ApiTags('Tasks')
@Controller('tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })

   
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthRequest) {
    try {
    const task = await this.taskService.create(createTaskDto, req);

    return {
      statuscode: HttpStatus.CREATED,
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status
      },
    };
    } catch (error) {
        throw new Error(
        `Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks for current user' })

  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async getMyTasks(
    @Req() req: AuthRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    try {
    const result = await this.taskService.findByOwner(
      req.user.id,
      page,
      limit,
      search,
    );

    return {
      statuscode: HttpStatus.OK,
      data: result,
    };
    } catch (error) {
      throw new Error(
        `Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    example: 'project',
  })
  @ApiResponse({ status: 200, description: 'All tasks retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    try {
    const result = await this.taskService.findAll(page,limit,search);

    return {
      statuscode: HttpStatus.OK,
      data: result,
    };
    } catch (error) {
      throw new Error(
        `Failed to get tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search task by title and owner' })
  @ApiQuery({ name: 'title', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async searchByTitle(@Query('title') title: string, @Req() req: AuthRequest) {
    try {
        const task = await this.taskService.findByTitleAndOwner(title, req.user.id);

    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
    } catch (error) {
      throw new Error(
        `Failed to get task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.taskService.findById(id);
     
    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
    } catch (error) {
      throw new Error(
        `Failed to get task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
    const task = await this.taskService.update(id, updateTaskDto);

    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
    } catch (error) {
      throw new Error(
        `Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple tasks' })
  @ApiResponse({ status: 200, description: 'Tasks deleted successfully' })
  async remove(@Body('ids') ids: string[]) {
    try {
    const deleted = await this.taskService.remove(ids);
      
    return {
      statuscode: HttpStatus.OK,
      message: deleted
        ? 'Tasks deleted successfully'
        : 'No tasks found to delete',
    };
    } catch (error) {
      throw new Error(
        `Failed to delete tasks: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
