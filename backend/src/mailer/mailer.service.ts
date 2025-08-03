import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tracklyn.team@gmail.com',
      pass: 'auuh eqqh russ zpss',
    },
  });

  async sendOtpEmail(email: string, otp: string) {
    const mailOptions = {
      from: '"Task Manager App: "tracklyn.team@gmail.com',
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendTaskAssignmentEmail(email: string, taskDetails: any) {
    const plainText = ` Hello ${taskDetails.name},

    You have been assigned a new task.

    Title: ${taskDetails.title}
    Description: ${taskDetails.description}
    Project Type: ${taskDetails.projectType}
    Status: ${taskDetails.status}
    Due Date: ${new Date(taskDetails.dueDate).toLocaleString()}

    Please check your dashboard for more details.
    Thank you,
    Tracklyn Team`;

    await this.transporter.sendMail({
      to: email,
      subject: `New Task Assigned: ${taskDetails.title}`,
      text: plainText,
    });
  }

}
