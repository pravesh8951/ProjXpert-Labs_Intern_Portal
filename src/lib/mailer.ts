import nodemailer from "nodemailer";
import { generateOfferLetterPDF, generateInvoicePDF } from "./pdfGenerator";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

const getEmailHeader = () => `
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #60a5fa; margin: 0; font-size: 28px; letter-spacing: 1px; font-weight: 800;">ProjXpert Labs</h1>
    <p style="color: #94a3b8; font-size: 14px; margin-top: 5px;">Futuristic AI & Cybersecurity Internships</p>
  </div>
  <hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, #3b82f6, transparent); margin: 20px 0;">
`;

const getEmailFooter = () => `
  <hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, #1e293b, transparent); margin: 30px 0;">
  <p style="color: #64748b; font-size: 13px; text-align: center; margin: 0;">This is an automated message from ProjXpert Labs. Please do not reply directly.</p>
  <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 5px;">&copy; ${new Date().getFullYear()} ProjXpert Labs. All rights reserved.</p>
`;

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "ProjXpert Labs - Email Verification OTP",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #05050f; color: #f8fafc; border-radius: 12px; border: 1px solid #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);">
        ${getEmailHeader()}
        <h2 style="color: #38bdf8; text-align: center; margin-bottom: 20px;">Verify Your Email Address</h2>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; text-align: center;">Please use the following One-Time Password (OTP) to complete your registration. This code will expire in 10 minutes.</p>
        <div style="background: rgba(59, 130, 246, 0.1); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; border: 1px dashed #3b82f6;">
          <h1 style="color: #60a5fa; letter-spacing: 8px; margin: 0; font-size: 36px;">${otp}</h1>
        </div>
        ${getEmailFooter()}
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "ProjXpert Labs - Password Reset Request",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #05050f; color: #f8fafc; border-radius: 12px; border: 1px solid #8b5cf6; box-shadow: 0 0 20px rgba(139, 92, 246, 0.15);">
        ${getEmailHeader()}
        <h2 style="color: #a78bfa; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">We received a request to reset the password associated with your ProjXpert Labs account. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">Reset My Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center; line-height: 1.5;">If you did not request this change, you can safely ignore this email. Your password will remain unchanged.</p>
        ${getEmailFooter()}
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendScheduleTestEmail = async (email: string, name: string, scheduledDate: string, testUrl: string) => {
  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "ProjXpert Labs - Your Test is Scheduled!",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #05050f; color: #f8fafc; border-radius: 12px; border: 1px solid #10b981; box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);">
        ${getEmailHeader()}
        <h2 style="color: #34d399; text-align: center; margin-bottom: 20px;">Test Scheduled Successfully!</h2>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Your eligibility test has been confirmed. Please note the scheduled time below:</p>
        <div style="background: rgba(16, 185, 129, 0.1); padding: 20px; border-radius: 10px; text-align: center; margin: 30px 0; border: 1px solid rgba(16, 185, 129, 0.3);">
          <h3 style="color: #34d399; margin: 0; font-size: 20px;">${scheduledDate}</h3>
        </div>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">The test consists of 20 multiple-choice questions assessing basic computer and logic skills. You need a score of at least 30% to qualify.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${testUrl}" style="background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">Launch Test Environment</a>
        </div>
        <p style="color: #94a3b8; font-size: 15px; text-align: center; font-style: italic;">Good luck! You've got this 🚀</p>
        ${getEmailFooter()}
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendTestPassedEmail = async (email: string, name: string, baseUrl: string) => {
  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Congratulations! You Passed the ProjXpert Labs Test 🎉",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #05050f; color: #f8fafc; border-radius: 12px; border: 1px solid #f59e0b; box-shadow: 0 0 20px rgba(245, 158, 11, 0.15);">
        ${getEmailHeader()}
        <h2 style="color: #fbbf24; text-align: center; margin-bottom: 20px;">Congratulations, ${name}! 🎉</h2>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">You have successfully passed the eligibility test! We are thrilled to officially select you for the ProjXpert Labs Internship Program.</p>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">The next step is to choose your internship plan duration and complete your enrollment to unlock your dashboard.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${baseUrl}/plans" style="background: linear-gradient(135deg, #d97706, #f59e0b); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);">Choose Your Plan</a>
        </div>
        <p style="color: #94a3b8; font-size: 15px; text-align: center; font-style: italic;">Welcome to the future of tech. We're excited to have you onboard! 🚀</p>
        ${getEmailFooter()}
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const sendPaymentSuccessEmail = async (email: string, name: string, plan: string, domain: string, paymentId: string, baseUrl: string) => {
  const offerLetterBuffer = await generateOfferLetterPDF(name, plan, domain);
  const invoiceBuffer = await generateInvoicePDF(name, plan, domain, paymentId);

  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "Payment Successful & Internship Offer Letter 🚀",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #05050f; color: #f8fafc; border-radius: 12px; border: 1px solid #ec4899; box-shadow: 0 0 20px rgba(236, 72, 153, 0.15);">
        ${getEmailHeader()}
        <h2 style="color: #f472b6; text-align: center; margin-bottom: 20px;">Welcome Aboard, ${name}! 🎉</h2>
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Your payment was successful and your enrollment is complete. We are thrilled to officially welcome you to the ProjXpert Labs Internship Program!</p>
        
        <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Attached to this email, you will find:</p>
        <ul style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
          <li>Your official <strong>Internship Offer Letter</strong></li>
          <li>Your <strong>Payment Invoice</strong></li>
        </ul>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${baseUrl}/dashboard" style="background: linear-gradient(135deg, #db2777, #ec4899); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">Access Your Dashboard</a>
        </div>
        ${getEmailFooter()}
      </div>
    `,
    attachments: [
      {
        filename: 'ProjXpert_Offer_Letter.pdf',
        content: offerLetterBuffer,
        contentType: 'application/pdf'
      },
      {
        filename: 'ProjXpert_Invoice.pdf',
        content: invoiceBuffer,
        contentType: 'application/pdf'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};
