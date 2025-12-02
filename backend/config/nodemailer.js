import nodemailer from "nodemailer";

const kuldEmail = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  //secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default kuldEmail;
