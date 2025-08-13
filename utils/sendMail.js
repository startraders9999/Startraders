const nodemailer = require('nodemailer');

async function sendOtpMail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `Star Traders <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP - Star Traders',
    text: `Your OTP is: ${otp}`
  });
}

module.exports = { sendOtpMail };
