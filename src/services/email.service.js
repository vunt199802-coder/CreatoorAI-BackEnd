const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send order paid email
 * @param {string} to
 * @returns {Promise}
 */
const sendOrderPaidEmail = async (to) => {
  const subject = '💲 User ordered to generated a song';
  // replace this url with the link to the email verification page of your front-end app
  const text = `Dear admin of CreatoorAI,
He ordered to generated a song with his child information. \n
Your should review this bear soon`;
  await sendEmail(to, subject, text);
};

/**
 * Send order paid email
 * @param {string} to
 * @returns {Promise}
 */
const sendOrderCreatedEmail = async (to) => {
  const subject = '💲 User paid for his song';
  // replace this url with the link to the email verification page of your front-end app
  const text = `Dear admin of CreatoorAI,
He paid $150 for his bear. \n
Your should aprove this bear soon`;
  await sendEmail(to, subject, text);
};

/**
 * Send bear creation email
 * @param {string} to
 * @returns {Promise}
 */
const sendBearApproveEmail = async (to) => {
  const subject = '🥇 Admin approved your bear';
  // replace this url with the link to the email verification page of your front-end app
  const text = `Dear user.
You can enjoy new song with your child.\n\n
Creatoor AI support \n`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOrderPaidEmail,
  sendOrderCreatedEmail,
  sendBearApproveEmail,
};
