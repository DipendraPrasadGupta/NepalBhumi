import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

export const sendVerificationEmail = async (email, verificationCode) => {
  const html = `
    <h2>Email Verification</h2>
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p>This code will expire in 24 hours.</p>
  `;
  return sendEmail(email, 'Email Verification - NepalBhumi', html);
};

export const sendPropertyApprovedEmail = async (email, propertyTitle) => {
  const html = `
    <h2>Property Approved!</h2>
    <p>Your property <strong>"${propertyTitle}"</strong> has been approved and is now live on NepalBhumi.</p>
    <p>Visit your dashboard to view analytics and manage your listing.</p>
  `;
  return sendEmail(email, 'Property Approved - NepalBhumi', html);
};

export const sendNewInquiryEmail = async (email, propertyTitle, buyerName) => {
  const html = `
    <h2>New Inquiry Received</h2>
    <p><strong>${buyerName}</strong> has shown interest in your property <strong>"${propertyTitle}"</strong></p>
    <p>Log in to your dashboard to view the inquiry and respond.</p>
  `;
  return sendEmail(email, 'New Inquiry - NepalBhumi', html);
};
