const { logger } = require("firebase-functions");
const nodemailer = require("nodemailer");

const mailer = async ({
  receiverEmailAddress,
  title,
  content,
}) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        logger.log(error);
        reject(error);
      } else {
        logger.log("nodemailer transporter 유효함");
        resolve(success);
      }
    });
  });

  const message = {
    from: process.env.EMAIL_SENDER,
    to: receiverEmailAddress,
    subject: title,
    html: content,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(message, function (error, info) {
      if (error) {
        logger.log(error);
        reject(error);
      } else {
        logger.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

module.exports = mailer;
