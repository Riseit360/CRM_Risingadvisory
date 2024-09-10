// packages & file import
const nodemailer = require("nodemailer");
let config = require("./config.json");

// Funtion Stup to mailer config
const transporter = nodemailer.createTransport({
    host: config.Gamil.SmtpServer,
    port: config.Gamil.SmtpPort,
    secure: true, // Use secure SSL connection
    auth: {
        user: config.Gamil.EmailFrom,
        pass: config.Gamil.Email_Password,
    },
});

// Export funtions
module.exports = transporter;