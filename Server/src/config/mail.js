require('dotenv').config();

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const sendEmail = async (email, price, courseName) => {
  const sentFrom = new Sender("rathodyogi15026026@gmail.com", "Yogendra's");

  const recipients = [
    new Recipient(email, "Your Client")
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Your Payment is Received")
    .setHtml(`<strong>Your Payment is Received ₹${price} for ${courseName}</strong>`)
    .setText(`Your Payment is Received ₹${price} for ${courseName}`);

  try {
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;