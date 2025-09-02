import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { getDatabaseConfig } from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';
import { requireEnv } from './utils/env';

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TaskModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: requireEnv('JWT_SECRET'),
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
