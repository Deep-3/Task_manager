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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, TaskQueryDto, UpdateTaskDto } from './task.dto';
import type { AuthRequest } from '../../auth/auth.interface';
import { JwtAuthGuard } from '../../middleware/auth.middleware';
import { RoleGuard } from '../../middleware/auth.middleware';
import { Roles } from '../../constant/role.decorator';
import { TaskMessage } from './task.constant';
import { TaskResponseDto } from './task.dto';
import { ErrorResponseDto } from '../../common/error-resonse.dto';
@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 200,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: TaskMessage.Error.TASK_NOT_FOUND,
    type: ErrorResponseDto,
  })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthRequest) {
    try {
      const task = await this.taskService.create(createTaskDto, req);

      return {
        statuscode: HttpStatus.CREATED,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        },
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks for current user' })
  @ApiResponse({ status: 200, description: TaskMessage.Info.RETRIEVE_TASKS })
  async getMyTasks(
    @Req() req: AuthRequest,
    @Query() { page = 1, limit = 10, search = '' }: TaskQueryDto,
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
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Get()
  @Roles('admin')
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
  async findAll(@Query() { page = 1, limit = 10, search = '' }: TaskQueryDto) {
    try {
      const result = await this.taskService.findAll(page, limit, search);

      return {
        statuscode: HttpStatus.OK,
        data: result,
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Get('search')
  @ApiOperation({ summary: 'Search task by title and owner' })
  @ApiQuery({ name: 'title', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: TaskMessage.Error.TASK_NOT_FOUND })
  async searchByTitle(@Query('title') title: string, @Req() req: AuthRequest) {
    try {
      const task = await this.taskService.findByTitleAndOwner(
        title,
        req.user.id,
      );

      return {
        statuscode: HttpStatus.OK,
        data: { task },
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: TaskMessage.Error.TASK_NOT_FOUND })
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.taskService.findById(id);

      return {
        statuscode: HttpStatus.OK,
        data: { task },
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: TaskMessage.Error.TASK_NOT_FOUND })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.taskService.update(id, updateTaskDto);

      return {
        statuscode: HttpStatus.OK,
        data: { task },
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple tasks' })
  @ApiResponse({
    status: 200,
    description: TaskMessage.Info.DELETE_TASK,
  })
  async remove(@Body('ids') ids: string[]) {
    try {
      const deleted = await this.taskService.remove(ids);

      return {
        statuscode: HttpStatus.OK,
        message: deleted
          ? TaskMessage.Info.DELETE_TASK
          : TaskMessage.Error.TASK_NOT_FOUND_TO_DELETE,
      };
    } catch (error) {
      return {
        statuscode: HttpStatus.NOT_FOUND,
        message: error.message,
      };
    }
  }
}
