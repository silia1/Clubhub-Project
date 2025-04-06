import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ResetToken } from '../schemas/reset-Token.schema';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', // The SMTP server hostname for Ethereal
      port: 587, // Port for sending emails
      secure: false, // Use STARTTLS instead of SSL/TLS
      auth: {
        user: 'natalia1@ethereal.email', // Your Ethereal email address
        pass: '5f5DPFDxCyBvn4cEwx', // Your Ethereal password
      },
      tls: {
        ciphers: 'SSLv3', // Optional, but recommended to enforce stronger encryption
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    // Generate the reset link using the actual token string (resetToken)
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
    const mailOptions = {
      from: '"Your App" <armando.schuppe@ethereal.email>', // Sender's email
      to: to, // Recipient's email
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>`, // Include the reset link
    };
  
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info)); // Preview URL to check email on Ethereal
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
  
  
  
}
