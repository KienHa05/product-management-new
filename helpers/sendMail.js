const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: html
  };

  if (attachments.length) {
    mailOptions.attachments = attachments;
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("SendMail Error:", error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};