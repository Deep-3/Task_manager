import { Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { getDatabaseConfig } from './config/database.config';
import { JwtModule } from '@nestjs/jwt';
import { TaskModule } from './modules/task/task.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { MiddlewareConsumer,  RequestMethod } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        ...getDatabaseConfig(),
      }),
      inject: [ConfigService],
    }),
    TaskModule, 
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET  || 'secretKey',
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
      consumer.apply(AuthMiddleware).exclude({ path:'/auth/login',method:RequestMethod.POST}, {path:'/auth/signup',method:RequestMethod.POST}).forRoutes('*');
    }
}
