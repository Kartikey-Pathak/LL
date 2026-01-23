import nodemailer from "nodemailer";

export async function Sendotpemail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LLama WebApp" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>Verify your account</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Valid for 10 minutes</p>
    `,
  });

  return true;
}
