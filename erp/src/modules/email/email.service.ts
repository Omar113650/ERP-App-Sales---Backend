import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface SendEmailProps {
  to: string;
  subject?: string;
  html?: string;
  otp?: string;
  title?: string;
  body?: string;
}

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.APP_EMAIL_ADDRESS, 
        pass: process.env.APP_EMAIL_PASSWORD, 
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendEmail({ to, subject, html }: SendEmailProps) {
    try {
      await this.transporter.sendMail({
        from: `"ERP App" <${process.env.APP_EMAIL_ADDRES}>`, 
        to: to.trim().toLowerCase(),
        subject: subject || 'ERP App Notification',
        html: html || '<p>You have a new notification.</p>',
      });

      this.logger.log(`📨 Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`❌ Email failed to ${to}: ${error.message}`);
      throw new Error('Email sending failed');
    }
  }


  async sendOtpEmail({ to, subject, otp }: SendEmailProps) {
    this.logger.log(`✉️ Sending otp email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
          <h1 style="color:#333; text-align:center; font-size:28px;">🔐 Verify Your Account</h1>
          <p style="text-align:center; color:#555;">Use the otp below. It expires in 5 minutes.</p>
          <div style="text-align:center; margin:30px 0;">
            <span style="
              font-size:36px;
              font-weight:bold;
              letter-spacing:10px;
              background:linear-gradient(90deg,#6a11cb,#2575fc);
              color:#fff;
              padding:20px 35px;
              border-radius:12px;
              display:inline-block;">
              ${otp}
            </span>
          </div>
          <p style="text-align:center; color:#777;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || 'Your otp Verification Code',
      html: htmlContent,
      otp,
    });
  }

  async sendOtpSuccessEmail({ to }: SendEmailProps) {
    this.logger.log(`✉️ Sending otp Success email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
          <h1 style="color:#28a745; text-align:center; font-size:28px;">✅ Verification Successful</h1>
          <p style="text-align:center; color:#555;">
            Your otp has been verified successfully. You can now log in to your account.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'otp Verification Successful',
      html: htmlContent,
    });
  }


  async sendWelcomeAfterLogin({ to, subject }: SendEmailProps) {
    this.logger.log(`✉️ Sending Welcome email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px; text-align:center;">
          <h1 style="color:#333; font-size:28px;">👋 Welcome Back!</h1>
          <p style="font-size:18px; color:#007bff; font-weight:bold;">
            You have successfully logged in
          </p>
          <p style="font-size:14px; color:#555;">
            We're happy to see you again! If this wasn’t you, secure your account immediately.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || 'Login Notification',
      html: htmlContent,
    });
  }


  async sendResetPasswordEmail(to: string, link: string) {
    this.logger.log(`✉️ Sending Reset Password email to: ${to}`);

    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px; text-align:center;">
          <h1 style="color:#d9534f; font-size:26px; margin-bottom:20px;">🔑 Reset Your Password</h1>
          <p style="font-size:16px; color:#555; margin-bottom:20px;">
            You requested to reset your password. Click the button below:
          </p>
          <a href="${link}" 
             style="display:inline-block; padding:15px 30px; font-size:16px; color:#fff; 
                    background:#007bff; border-radius:8px; text-decoration:none; margin:20px 0;">
            Reset Password
          </a>
          <p style="font-size:14px; color:#777; margin-top:20px;">
            If you didn't request this, you can ignore this email.
          </p>
          <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />
          <p style="font-size:12px; color:#999;">© ${new Date().getFullYear()} Your Company</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: 'Reset Your Password',
      html: htmlContent,
    });
  }


  async NotificationNewEvent({ to, subject, title, body }: SendEmailProps) {
    const htmlContent = `
      <div style="font-family: Helvetica, Arial; background:#f4f4f7; padding:40px 0;">
        <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:12px;">
          <h2 style="color:#333; text-align:center;">🔔 ${title}</h2>
          <p style="font-size:16px; color:#555; margin-top:20px;">${body}</p>
          <div style="margin-top:30px; font-size:12px; color:#999; text-align:center;">
            This notification was sent automatically after event creation.
          </div>
        </div>
      </div>
    `;

    return this.sendEmail({
      to,
      subject: subject || title,
      html: htmlContent,
    });
  }
}
































