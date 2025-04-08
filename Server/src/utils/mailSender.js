const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

        // Verify transporter connection
        

        let info = await transporter.sendMail({
            from: `Edtech Platform by Yogi <${process.env.MAIL_USER}>`,
            to: email, // List of receivers
            subject: title, // Subject line
            html: body, // HTML body
        });

        console.log("Email sent successfully:", info.response);
        return info;
    } catch (error) {
        console.log("Error occurred while sending email:", error.message);
        return error.message;
    }
};

module.exports = mailSender;
