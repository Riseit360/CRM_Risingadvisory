const config = require("../../config/config.json");
const transporter = require("../../config/mailer");
const ejs = require("ejs");
const moment = require("moment");

class OTPAuthEmail {

    async SendEmailOtp(data, OTP, userAgentData, siteUrl, cb) {

        // Add the current date to the template data
        const templateData = {
            Udata: data,
            VerifyOTP: OTP,
            devices: userAgentData,
            URl: siteUrl,
            currentDate: moment().format('DD MMMM YYYY, h:mm:ss a')
        };

        ejs.renderFile("./views/email/otp_email_client.ejs", templateData, (err, tfile) => {
            if (err) {
                console.error("Error rendering EJS file:", err);
                return cb({ Status: "err", Msg: "Error while compiling file" });
            }

            const mainOptions = {
                from: '"TaxManager" <taxmanager.bittu@gmail.com>',
                to: `${data.Email}, ${config.Gamil.EmailFrom}`,
                subject: 'OTP Verification - TaxManager',
                html: tfile
            };

            transporter.sendMail(mainOptions, (err, info) => {
                if (err) {
                    console.error("Error sending email:", err);
                    return cb({ Status: "err", Msg: "Error while sending email" });
                }
                console.log('Email sent:', info.response);
                return cb({ Status: "ok", Msg: "Email sent successfully" });
            });
        });
    }

    // Add other methods if needed
}

module.exports = OTPAuthEmail;