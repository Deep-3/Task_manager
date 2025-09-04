import { Task } from './task.entity';
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface TaskPagination {
  tasks: Task[];
  page: number;
  total: number;
}
