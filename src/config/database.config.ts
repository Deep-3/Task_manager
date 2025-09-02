import { appConfig } from './app.config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/modules/user/user.entity';
import { Task } from 'src/modules/task/task.entity';
export const getDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: appConfig.dbHost,
  port: parseInt(appConfig.dbPort, 10),
  username: appConfig.dbUsername,
  password: appConfig.dbPassword,
  database: appConfig.dbName,
  synchronize: true,
  logging: false,
  entities: [User, Task],
});
