import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { typeormConfig } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';
import { requireEnv } from './utils/env';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { MailQueueModule } from './modules/mail-queue/mail-queue.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:6379',
    }),
    TaskModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: requireEnv('JWT_SECRET'),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailQueueModule,
  ],
  controllers: [],
  providers: [AppService],
  exports: [RedisModule],
})
export class AppModule {}
