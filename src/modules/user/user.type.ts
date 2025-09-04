import { User } from './user.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface UserPagination {
  users: User[];
  page: number;
  total: number;
}
