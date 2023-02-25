import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  async sendInvitationEmail(email: string, code: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const message = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'You are invited to join the Super Awesome Platform!',
      html: `Hello,<br /><br />You have been invited to join our Super Awesome Platform. Your invitation code is <strong>${code}</strong>. Please <a href="https://yourplatform.com/register">click here</a> to register with your email address and invitation code.<br /><br />Best regards,<br />Pavithran,<br />Super Awesome Team.`,
    };

    await transporter.sendMail(message);
  }
}
