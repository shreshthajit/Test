const sgMail = require('@sendgrid/mail');
const appConfig = require('../../config');
sgMail.setApiKey(appConfig.sendGrid.apiKey);

const sendEmail = async (to, subject, htmlContent) => {
    const msg = {
        to,
        from: appConfig.sendGrid.senderEmail,
        subject,
        html: htmlContent,
      };
    
      try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email', error);
        throw error;
      }
}

module.exports = sendEmail;