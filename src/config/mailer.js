const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Vérifie la connexion SMTP au démarrage
 */
const verifyMailer = async () => {
  try {
    await transporter.verify();
    console.log('✅ Mailer SMTP connecté');
  } catch (err) {
    console.error('❌ Mailer SMTP erreur :', err.message);
  }
};

/**
 * Envoie un mail
 * @param {Object} options - { to, subject, html, cc? }
 */
const sendMail = async ({ to, subject, html, cc }) => {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject,
    html,
    ...(cc && { cc }),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { transporter, sendMail, verifyMailer };
