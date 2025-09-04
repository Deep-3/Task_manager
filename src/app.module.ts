import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { typeormConfig } from './config/typeorm.config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';
import { requireEnv } from './utils/env';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
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
