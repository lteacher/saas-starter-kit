import { ConfigurationError, EmailServiceError } from '@saas-starter/utils';
import type { EmailConfig, InvitationEmailData, EmailResponse } from '@saas-starter/types';

// Gets email configuration from environment variables
const getEmailConfig = (): EmailConfig => {
  const { EMAIL_API_KEY, EMAIL_FROM_ADDRESS, EMAIL_FROM_NAME, EMAIL_API_URL } = process.env;

  if (!EMAIL_API_KEY || !EMAIL_FROM_ADDRESS) {
    throw new ConfigurationError(
      'Email service not configured - missing EMAIL_API_KEY or EMAIL_FROM_ADDRESS',
    );
  }

  return {
    apiKey: EMAIL_API_KEY,
    fromEmail: EMAIL_FROM_ADDRESS,
    fromName: EMAIL_FROM_NAME || 'SaaS Starter Kit',
    apiUrl: EMAIL_API_URL || 'https://api.resend.com/emails',
  };
};

// Generates invitation email HTML template
const generateInvitationTemplate = (data: InvitationEmailData): string => {
  const inviteUrl = `${data.baseUrl}/invite/${data.token}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invitation to ${data.appName}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; background: #ffffff; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; background: #f9fafb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 ${data.appName}</h1>
        </div>
        
        <div class="content">
          <h2>You've been invited!</h2>
          <p>Hello,</p>
          <p><strong>${data.invitedByName}</strong> has invited you to join <strong>${data.appName}</strong>.</p>
          <p>Click the button below to accept your invitation and create your account:</p>
          
          <a href="${inviteUrl}" class="button">Accept Invitation</a>
          
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${inviteUrl}">${inviteUrl}</a></p>
          
          <p><strong>Note:</strong> This invitation will expire in 7 days.</p>
        </div>
        
        <div class="footer">
          <p>This invitation was sent by ${data.appName}</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generates invitation email plain text version
const generateInvitationText = (data: InvitationEmailData): string => {
  const inviteUrl = `${data.baseUrl}/invite/${data.token}`;

  return `You've been invited to join ${data.appName}!

${data.invitedByName} has invited you to join ${data.appName}.

To accept your invitation and create your account, visit:
${inviteUrl}

This invitation will expire in 7 days.

If you didn't expect this invitation, you can safely ignore this email.

---
${data.appName}`;
};

// Sends email using Resend API
const sendEmail = async (
  config: EmailConfig,
  { to, subject, html, text }: { to: string; subject: string; html: string; text: string },
): Promise<EmailResponse> => {
  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${config.fromName} <${config.fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new EmailServiceError(`Email API error: ${response.status} - ${errorData}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (err) {
    if (err instanceof EmailServiceError) {
      throw err;
    }
    throw new EmailServiceError(
      `Failed to send email: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
  }
};

// Sends invitation email to a user
export const sendInvitationEmail = async (data: InvitationEmailData): Promise<EmailResponse> => {
  const config = getEmailConfig();
  const html = generateInvitationTemplate(data);
  const text = generateInvitationText(data);
  const subject = `You've been invited to join ${data.appName}`;

  return sendEmail(config, {
    to: data.to,
    subject,
    html,
    text,
  });
};

// Verifies email service configuration
export const verifyEmailService = async (): Promise<boolean> => {
  getEmailConfig(); // Will throw if configuration is invalid
  return true;
};
