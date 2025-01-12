const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sends an email via SendGrid.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email plain text.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, text) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error(
      'Error sending email:',
      error.response?.body || error.message,
    );
    throw new Error('Failed to send email');
  }
};

module.exports = {sendEmail};
