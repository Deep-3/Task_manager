import { DataSource, DataSourceOptions } from 'typeorm';

import { appConfig } from './app.config';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: appConfig.dbHost,
  port: +appConfig.dbPort,
  username: appConfig.dbUsername,
  password: appConfig.dbPassword,
  database: appConfig.dbName,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: false,
};
const dataSource = new DataSource(typeormConfig);

export default dataSource;
