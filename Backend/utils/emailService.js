import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.EMAIL_USER}`,
    pass: `${process.env.EMAIL_PASS}`
  },
  logger: true,
  debug: true
});

export const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Lost & Found" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
};