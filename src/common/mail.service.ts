import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { appConfig } from 'src/config/app.config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: appConfig.smtpHost,
      port: appConfig.smtpPort,
      secure: false,
      auth: {
        user: appConfig.smtpUser,
        pass: appConfig.smtpPass,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: appConfig.smtpUser,
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
