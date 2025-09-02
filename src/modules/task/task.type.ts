import { Task } from './task.entity';
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface TaskPagination {
  rows: Task[];
  page: number;
  total: number;
}
