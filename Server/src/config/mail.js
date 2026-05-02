import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

export const sendEmail = async (email,price,courseName) => {
  const sentFrom = new Sender("rathodyogi15026026@gmail.com", "Yogendra's");

  const recipients = [
    new Recipient(email, "Your Client")
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Your Payement is Receieved")
    .setHtml(`<strong> Your Payement is Receieved ${price} for ${courseName}</strong>`)
    .setText(`<strong> Your Payement is Receieved ${price} for ${courseName}</strong>`);

  try {
    await mailerSend.email.send(emailParams);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


// module.exports = sendEmail;
