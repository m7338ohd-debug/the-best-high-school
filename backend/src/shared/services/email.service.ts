import nodemailer from 'nodemailer';
import { LoggerService } from '../logger/logger.service.js';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const rawPass = process.env.EMAIL_PASSWORD || 'hlwg yfgi xmkn lqmg';
    const cleanPass = rawPass.replace(/\s+/g, '');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'pmahboob001@gmail.com',
        pass: cleanPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Dispatches a real school tenant activation invitation email to any recipient address via Gmail.
   */
  async sendSchoolInvitationEmail(
    schoolName: string,
    recipientEmail: string,
    recipientName: string,
    invitationToken: string,
    licenseKey: string
  ): Promise<boolean> {
    const activationUrl = `http://localhost:5173/accept-invitation?token=${invitationToken}&email=${encodeURIComponent(recipientEmail)}&school=${encodeURIComponent(schoolName)}`;

    const plainTextContent = `
Hello ${recipientName},

Your school instance ${schoolName} has been successfully provisioned on The Best School Multi-Tenant SaaS Platform.

School License Key: ${licenseKey}

Activate your account by clicking the link below (valid for 72 hours):
${activationUrl}

© 2026 The Best School SaaS Platform.
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 30px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 10px 25px rgba(126, 34, 206, 0.1); border: 1px solid #e9d5ff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%); width: 60px; height: 60px; border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; color: #ffffff; font-size: 28px; font-weight: bold; margin-bottom: 15px;">
              🎓
            </div>
            <h2 style="color: #4c1d95; margin: 0; font-size: 24px; font-weight: 800;">Welcome to The Best School ERP</h2>
            <p style="color: #6b21a8; font-size: 14px; margin-top: 5px;">Tenant Account Provisioning & Activation</p>
          </div>

          <p style="font-size: 16px; line-height: 1.6; color: #334155;">Hello <strong>${recipientName}</strong>,</p>

          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            Your school instance <strong>${schoolName}</strong> has been successfully provisioned on <strong>The Best School Multi-Tenant SaaS Platform</strong>.
          </p>

          <div style="background-color: #faf5ff; border: 1px solid #d8b4fe; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b21a8;"><strong>School License Key:</strong></p>
            <code style="font-size: 18px; font-weight: bold; color: #7e22ce; background: #ffffff; padding: 6px 12px; border-radius: 6px; border: 1px solid #c084fc; display: inline-block;">${licenseKey}</code>
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #9333ea;">* This invitation link will expire in <strong>72 hours</strong>.</p>
          </div>

          <div style="text-align: center; margin: 35px 0;">
            <a href="${activationUrl}" style="background: linear-gradient(135deg, #7e22ce 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(126, 34, 206, 0.3);">
              Set Password & Activate School Portal →
            </a>
          </div>

          <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 30px;">
            If you did not request this invitation, please ignore this email or contact support.
          </p>

          <hr style="border: none; border-top: 1px solid #f3e8ff; margin: 30px 0;" />
          
          <div style="text-align: center; font-size: 12px; color: #94a3b8;">
            © 2026 The Best School SaaS Platform. All Rights Reserved.
          </div>
        </div>
      </div>
    `;

    try {
      const senderUser = process.env.EMAIL_USER || 'pmahboob001@gmail.com';
      const info = await this.transporter.sendMail({
        from: `"The Best School SaaS" <${senderUser}>`,
        to: recipientEmail,
        replyTo: senderUser,
        subject: `[Action Required] Activate ${schoolName} ERP Account`,
        text: plainTextContent,
        html: htmlContent,
      });

      console.log(`[EmailService] SUCCESS: School invitation email dispatched to ${recipientEmail}. Message ID: ${info.messageId}`);
      LoggerService.info(`[EmailService] School invitation email dispatched to ${recipientEmail}. Message ID: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EmailService] ERROR: Failed to send invitation email to ${recipientEmail}:`, error);
      LoggerService.error(`[EmailService] Failed to send invitation email to ${recipientEmail}:`, error);
      return false;
    }
  }
}

export const emailService = new EmailService();
