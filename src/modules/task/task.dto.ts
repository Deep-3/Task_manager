import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from './task.type';

export class CreateTaskDto {
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
