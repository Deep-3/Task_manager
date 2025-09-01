import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { RoleMiddleware } from 'src/middleware/auth.middleware';
import { UserRole } from './user.type';
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule{
    configure(consumer: MiddlewareConsumer): void {
      consumer.apply(RoleMiddleware(UserRole.ADMIN)).forRoutes({
          path: 'auth/users',
          method: RequestMethod.GET,
        });
    }
}
