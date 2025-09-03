import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskOwnerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}

export class TaskResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  description: string | null;

  @ApiProperty()
  status: string;
}
export class TaskSingleResponseDto {
  @ApiProperty({ example: 200 })
  statuscode?: number;

  @ApiProperty({ type: TaskResponseDto })
  data: TaskResponseDto;
}

export class TaskPaginationDto {
  @ApiProperty({ example: 200 })
  statuscode: number;

  @ApiProperty({ type: [TaskResponseDto] })
  data: TaskResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  total: number;
}

export class DeleteTaskResponseDto {
  @ApiProperty({ example: 200 })
  statuscode: number;

  @ApiProperty({ example: 'Task deleted successfully' })
  message: string;
}
