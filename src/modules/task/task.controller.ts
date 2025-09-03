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
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  DeleteTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
} from './task.dto';
import type { AuthRequest } from '../../auth/auth.interface';
import { JwtAuthGuard } from '../../middleware/auth.middleware';
import { RoleGuard } from '../../middleware/auth.middleware';
import { Roles } from '../../constant/role.decorator';
import { TaskMessage } from './task.constant';
import { ApiErrorResponse } from '../../constant/swagger.decorator';
import {
  TaskSingleResponseDto,
  TaskPaginationDto,
  TaskResponseDto,
} from './task.response.dto';
import type { Response } from 'express';
import {
  ResponseHandler,
  SuccessCommonResponse,
} from '../../common/response.utils';
import { Successdata } from 'src/common/response.dto';
import { TaskPagination } from './task.type';

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
    type: TaskSingleResponseDto,
  })
  @ApiErrorResponse()
  async create(
    @Res() res: Response,
    @Body() createTaskDto: CreateTaskDto,
    @Req() req: AuthRequest,
  ): Promise<Response<SuccessCommonResponse<TaskResponseDto>>> {
    try {
      const task = await this.taskService.create(createTaskDto, req);
      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.CREATED,
        data: {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get('my-tasks')
  @ApiOperation({ summary: 'Get tasks for current user' })
  @ApiResponse({
    status: 200,
    description: TaskMessage.Info.RETRIEVE_TASKS,
    type: TaskPaginationDto,
  })
  @ApiErrorResponse()
  async getMyTasks(
    @Res() res: Response,
    @Req() req: AuthRequest,
    @Query() { page, limit, search }: TaskQueryDto,
  ): Promise<Response<SuccessCommonResponse<TaskPagination>>> {
    try {
      const result = await this.taskService.findByOwner(
        req.user.id,
        page,
        limit,
        search,
      );

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: result,
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all tasks (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'All tasks retrieved successfully',
    type: TaskPaginationDto,
  })
  @ApiErrorResponse()
  async findAll(
    @Res() res: Response,
    @Query() { page, limit, search }: TaskQueryDto,
  ): Promise<Response<SuccessCommonResponse<TaskPagination>>> {
    try {
      const AllTasks = await this.taskService.findAll(page, limit, search);

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: AllTasks,
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    type: TaskSingleResponseDto,
  })
  @ApiErrorResponse()
  async findOne(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<
    Response<SuccessCommonResponse<{ task: TaskResponseDto | null }>>
  > {
    try {
      const task = await this.taskService.findById(id);

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: { task },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: TaskSingleResponseDto,
  })
  @ApiErrorResponse()
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res: Response,
  ): Promise<
    Response<SuccessCommonResponse<{ task: TaskResponseDto | null }>>
  > {
    try {
      const task = await this.taskService.update(id, updateTaskDto);
      console.log(task);

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: { task },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Delete multiple tasks' })
  @ApiResponse({
    status: 200,
    description: TaskMessage.Info.DELETE_TASK,
    type: DeleteTaskDto,
  })
  @ApiErrorResponse()
  async remove(
    @Body() { ids }: DeleteTaskDto,
    @Res() res: Response,
  ): Promise<Response<SuccessCommonResponse<Successdata>>> {
    try {
      const deleted = await this.taskService.remove(ids);

      return ResponseHandler.success({
        res,
        statuscode: HttpStatus.OK,
        data: {
          message: deleted
            ? TaskMessage.Info.DELETE_TASK
            : TaskMessage.Error.TASK_NOT_FOUND_TO_DELETE,
        },
      });
    } catch (error) {
      return ResponseHandler.error({
        res,
        error,
      });
    }
  }
}
