import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from './task.type';
import { Type } from 'class-transformer';

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

export class DeleteTaskDto {
  @ApiProperty({ example: ['0DFGHJ5MGGG2V'] })
  @IsString()
  @IsArray()
  ids: string[];
}

export class TaskQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'project' })
  @IsOptional()
  @IsString()
  search?: string = '';
}
