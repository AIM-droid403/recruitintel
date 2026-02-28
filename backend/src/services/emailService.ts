import { sendEmail } from '../utils/mailer';

/**
 * Sends a password reset email with a secure token link.
 */
export const sendResetEmail = async (to: string, token: string) => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="margin-bottom: 24px;">
                <span style="background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: transparent; font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">RecruitIntel</span>
            </div>
            <h1 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 16px;">Reset Your Security Key</h1>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">We received a request to regenerate your security credentials. Click the specialized button below to initialize the reset signal.</p>
            <div style="text-align: center; margin-bottom: 32px;">
                <a href="${resetUrl}" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Initialize Reset Signal</a>
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 16px;">This signal will expire in 1 hour. If you did not request this authorization, please ignore this transmission.</p>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 24px;">
                <p style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">AES-256 Encrypted | Neural Matching Infrastructure</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to,
        subject: '🔒 Action Required: Reset Your RecruitIntel Security Key',
        html: htmlTemplate,
    });
};

/**
 * Notifies an employer when their token balance drops below a threshold.
 */
export const notifyEmployerLowBalance = async (employerEmail: string, balance: number) => {
    const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="margin-bottom: 24px;">
                <span style="background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: transparent; font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">RecruitIntel</span>
            </div>
            <h1 style="color: #ef4444; font-size: 20px; font-weight: 800; margin-bottom: 16px;">Alert: Low Token Balance</h1>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">Your current Neural Search token balance is critically low.</p>
            <div style="background-color: #fef2f2; border: 1px solid #fee2e2; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                <span style="color: #ef4444; font-size: 24px; font-weight: 800;">${balance} Tokens</span>
            </div>
            <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">Please log in to your dashboard to top up via our secure payment gateway to avoid disruption to your AI screening services.</p>
            <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/employer/billing" style="background-color: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; display: inline-block; font-size: 14px;">Top Up Credits</a>
            </div>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 32px;">
                <p style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">RecruitIntel Financial Services</p>
            </div>
        </div>
    `;

    await sendEmail({
        to: employerEmail,
        subject: '⚠️ Action Required: Low Token Balance Alert',
        html: htmlTemplate,
    });
};

/**
 * Sends a direct message from the admin to a user.
 */
export const sendAdminMessage = async (to: string, subject: string, content: string) => {
    const htmlTemplate = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="margin-bottom: 24px;">
                <span style="background: linear-gradient(to right, #3b82f6, #8b5cf6); -webkit-background-clip: text; color: transparent; font-size: 24px; font-weight: 900; letter-spacing: -0.05em;">RecruitIntel Admin</span>
            </div>
            <h1 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 16px;">${subject || 'System Notification'}</h1>
            <div style="color: #1e293b; font-size: 15px; line-height: 1.6; margin-bottom: 24px; background-color: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                ${content.replace(/\n/g, '<br/>')}
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6;">If you have any questions regarding this message, please respond via your dashboard support channel.</p>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 32px;">
                <p style="color: #cbd5e1; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">RecruitIntel Governance Division</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to,
        subject: `[RecruitIntel] ${subject}`,
        html: htmlTemplate,
    });
};
