const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = (toEmail, token) => {
    const url = encodeURI(`${process.env.BASE_APP_URL}/auth/verify/email/${toEmail}/token/${token}`)
    const message = `Hello, 
    Welcome to Bowled Over. Click the link below to verify your email and start using the app 
    ${url}`
    const msg = {
        to: toEmail,
        from: 'admin@bowledover.com',
        subject: 'Bowled Over - Verify your email address',
        text: message,
        html: message,
    };
    // if (process.env.NODE_ENV === 'local') {
    //     msg.mail_settings = {
    //         sandbox_mode: {
    //             enable: true
    //         }
    //     }
    // }
    sgMail.send(msg)
        .then(res => {
            console.log('successfully sent msg', msg)
        })
        .catch(err => console.error('whoops, coudlnt sent email', err))
}

module.exports = {
    sendVerificationEmail
}