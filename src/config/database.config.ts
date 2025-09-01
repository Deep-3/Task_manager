import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from 'src/modules/task/task.entity';
import { User } from 'src/modules/user/user.entity';

export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'taskmanager',
  entities: [User, Task],
  synchronize: true,
  logging: false,
});
