import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { OtpService } from '../../common/otp.service';
import { MailQueueModule } from '../mail-queue/mail-queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailQueueModule],
  controllers: [UserController],
  providers: [UserService, OtpService],
  exports: [UserService],
})
export class UserModule {}
