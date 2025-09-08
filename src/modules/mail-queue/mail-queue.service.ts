import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

export interface SendMailData {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async addToMailQueue(data: SendMailData) {
    await this.mailQueue.add('send-mail', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
