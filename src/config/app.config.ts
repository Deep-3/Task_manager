import { requireEnv } from '../utils/env';

export const appConfig = {
  port: requireEnv('PORT'),
  env: requireEnv('NODE_ENV'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: requireEnv('JWT_EXPIRES_IN'),
  jwtRefreshExpiresIn: requireEnv('JWT_REFRESH_EXPIRES_IN'),
  dbHost: requireEnv('DB_HOST'),
  dbPort: requireEnv('DB_PORT'),
  dbUsername: requireEnv('DB_USERNAME'),
  dbPassword: requireEnv('DB_PASSWORD'),
  dbName: requireEnv('DB_NAME'),
};
