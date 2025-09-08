import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailService } from '../../common/mail.service';
import { Injectable } from '@nestjs/common';
type MailJobData = {
  to: string;
  subject: string;
  text: string;
};

@Processor('mail-queue')
@Injectable()
export class MailQueueProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<MailJobData>): Promise<void> {
    const { to, subject, text } = job.data;
    await this.mailService.sendMail(to, subject, text);
  }
}
