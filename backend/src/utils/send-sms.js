const twilio = require('twilio');
const appConfig = require('../../config');

const sendSms = async (body, phone) => {
    try {
        const twilioClient = new twilio(appConfig.twilio.accountSid, appConfig.twilio.authToken);
        // Send SMS
        await twilioClient.messages.create({
            body,
            to: phone,
            from: appConfig.twilio.authPhone,
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('Error sending SMS', error);
        throw error;
    }
}

module.exports = sendSms;