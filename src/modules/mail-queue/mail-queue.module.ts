import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MailQueueService } from './mail-queue.service';
import { MailQueueProcessor } from './mail-queue.processor';
import { MailService } from '../../common/mail.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
  ],
  providers: [MailQueueService, MailQueueProcessor, MailService],
  exports: [MailQueueService],
})
export class MailQueueModule {}
