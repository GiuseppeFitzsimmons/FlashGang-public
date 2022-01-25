const nodeMailer = require('nodemailer');

const sendMail = async ( send ) => {
    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT ? process.env.SMTP_PORT : 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER_NAME,
            pass: process.env.SMTP_PASSWORD
        }
    });
    console.log("sendMail", send);
    let mailOptions = {
        from: send.from,
        to: Array.isArray(send.to) ? send.to.join(',') : send.to,
        subject: send.subject,
        text: send.text,
        html: send.html
    };
    console.log("sendMail mailOptions", mailOptions);
    return await new Promise( (resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error", error);
                reject(error)
            } else {
                console.log('Message sent', info);
                resolve(info);
            }
        });
    })
}
sendResetEmail = async (emailAddress, token) => {
    let email = Buffer.from(emailAddress).toString('base64');
    let sendParams={
        from: process.env.MEMBERSHIP_SENDMAIL_ADDRESS,
        to: emailAddress,
        subject: "FlashGang password reset",
        text: `Click here to reset your password: ${process.env.PASSWORD_RESET}?resetpassword=true&token=${token}&email=${email} !`,
        html: `Click here to reset your password: ${process.env.PASSWORD_RESET}?resetpassword=true&token=${token}&email=${email} !`
    }
    console.log('sendParams', sendParams)
    return await sendMail(sendParams)
}

sendInvitationMail = async (invitor, invitee, gang) => {
    let sendParams={
        from: process.env.MEMBERSHIP_SENDMAIL_ADDRESS,
        to: invitee,
        subject: "You've been invited to a FlashGang",
        text: `${invitee} has been invited by ${invitor} to join FlashGang ${gang} - click here to accept: ${process.env.RSVP_URL}?invitee=${invitee}`,
        html: `<b>${invitee}</b> has been invited by ${invitor} to join FlashGang, <b><i>${gang}</i></b></a> - click <a href='${process.env.RSVP_URL}?invitee=${invitee}'>here</a> to accept.`
    }
    console.log('sendParams', sendParams)
    return await sendMail(sendParams)
}

module.exports = {
    sendMail,
    sendInvitationMail,
    sendResetEmail
};
