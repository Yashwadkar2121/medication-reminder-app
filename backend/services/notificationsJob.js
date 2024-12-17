const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Create a transporter using email credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'gmail' or any SMTP service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email notification
const sendEmailNotification = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, // Recipient's email
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Notification email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = sendEmailNotification;
