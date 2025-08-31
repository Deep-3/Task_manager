import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AuthRequest } from '../../auth/interfaces/auth-request.interface';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthRequest) {
    const task = await this.taskService.create({
      ...createTaskDto,
      ownerId: req.user.id,
    });

    return {
      statuscode: HttpStatus.CREATED,
      data: { task },
    };
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'project' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  async getMyTasks(
    @Req() req: AuthRequest,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    const result = await this.taskService.findByOwner(req.user.id, page, limit, search);
    
    return {
      statuscode: HttpStatus.OK,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'project' })
  @ApiResponse({ status: 200, description: 'All tasks retrieved successfully' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ) {
    const result = await this.taskService.findAll(page, limit, search);
    
    return {
      statuscode: HttpStatus.OK,
      data: result,
    };
  }

  @Get('search')
  @ApiOperation({ summary: 'Search task by title and owner' })
  @ApiQuery({ name: 'title', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Task found' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async searchByTitle(
    @Query('title') title: string,
    @Req() req: AuthRequest,
  ) {
    const task = await this.taskService.findByTitleAndOwner(title, req.user.id);
    
    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string) {
    const task = await this.taskService.findById(id);
    
    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.update(id, updateTaskDto);
    
    return {
      statuscode: HttpStatus.OK,
      data: { task },
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple tasks' })
  @ApiResponse({ status: 200, description: 'Tasks deleted successfully' })
  async remove(@Body('ids') ids: string[]) {
    const deleted = await this.taskService.remove(ids);
    
    return {
      statuscode: HttpStatus.OK,
      message: deleted ? 'Tasks deleted successfully' : 'No tasks found to delete',
    };
  }
}
