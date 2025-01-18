const sgMail = require('@sendgrid/mail');
const {compileTemplate} = require('../utils/compileTemplate/compileTemplate');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, templateName, variables) => {
  try {
    const htmlContent = compileTemplate(templateName, variables);
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html: htmlContent,
    });
  } catch (error) {
    console.error(
      'Error sending email:',
      error.response?.body || error.message,
    );
    throw new Error('Failed to send email');
  }
};

module.exports = {sendEmail};
