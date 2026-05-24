import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"ProjXpert Labs" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: "ProjXpert Labs - Email Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a1a; color: #ffffff; border-radius: 10px; border: 1px solid #7c3aed;">
        <h2 style="color: #00d4ff; text-align: center;">Welcome to ProjXpert Labs</h2>
        <p style="color: #e2e8f0; font-size: 16px;">Please use the following OTP to verify your email address. This OTP is valid for 10 minutes.</p>
        <div style="background-color: #ffffff0d; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #7c3aed; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you did not request this, please ignore this email.</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a1a; color: #ffffff; border-radius: 10px; border: 1px solid #7c3aed;">
        <h2 style="color: #00d4ff; text-align: center;">Password Reset Request</h2>
        <p style="color: #e2e8f0; font-size: 16px;">You requested to reset your password. Please click the button below to reset it. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a1a; color: #ffffff; border-radius: 10px; border: 1px solid #7c3aed;">
        <h2 style="color: #00d4ff; text-align: center;">Test Scheduled Successfully!</h2>
        <p style="color: #e2e8f0; font-size: 16px;">Hi <strong>${name}</strong>,</p>
        <p style="color: #e2e8f0; font-size: 16px;">Your eligibility test has been scheduled for:</p>
        <div style="background-color: #7c3aed22; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; border: 1px solid #7c3aed;">
          <h3 style="color: #7c3aed; margin: 0;">${scheduledDate}</h3>
        </div>
        <p style="color: #e2e8f0; font-size: 16px;">When you're ready to begin, click the button below. The test consists of 20 basic computer questions and you need to score at least 30% to qualify.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${testUrl}" style="background-color: #00d4ff; color: #0a0a1a; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Appear for Test</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">Good luck! You've got this 🚀</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a1a; color: #ffffff; border-radius: 10px; border: 1px solid #00d4ff;">
        <h2 style="color: #00d4ff; text-align: center;">Congratulations, ${name}! 🎉</h2>
        <p style="color: #e2e8f0; font-size: 16px;">You have successfully passed the eligibility test and are now selected for the ProjXpert Labs Internship Program!</p>
        <p style="color: #e2e8f0; font-size: 16px;">The next step is to choose your internship plan and complete your enrollment.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/plans" style="background-color: #7c3aed; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Choose Your Plan</a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; text-align: center;">Welcome to ProjXpert Labs! We're excited to have you onboard 🚀</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
