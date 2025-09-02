import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from './task.type';

export class CreateTaskDto {
  @ApiPropertyOptional({ example: '0DFGHJ5MGGG2V' })
  @IsOptional()
  @IsString()
  id: string;
  @ApiProperty({ example: 'Complete project documentation' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Write comprehensive documentation for the project',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status = TaskStatus.TODO;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated task title' })
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class TaskQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ example: 'project' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class TaskResponseDto {
  @ApiProperty({ example: 200 })
  statuscode: number;
  @ApiProperty({ example: CreateTaskDto })
  data: CreateTaskDto;
}
