const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    console.log("No EMAIL_USER in .env. Creating dummy Ethereal email account for testing...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal dummy email configured: ${testAccount.user}`);
  }
  return transporter;
};

const sendEmail = async (options) => {
  try {
    const t = await getTransporter();
    const info = await t.sendMail(options);
    
    if (!process.env.EMAIL_USER) {
      console.log("=========================================");
      console.log("📧 MOCK EMAIL SENT SUCESSFULLY!");
      console.log("📧 View Email Preview Here: %s", nodemailer.getTestMessageUrl(info));
      console.log("=========================================");
    }
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };