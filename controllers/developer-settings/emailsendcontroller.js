const ejs = require("ejs");
const nodemailer = require("nodemailer");

class EmailSent {
    // Sends thank you email to client and cc to us
    async sendemailtous(formData, cb) {
        try {

            // Configure the transporter dynamically
            const transporter = nodemailer.createTransport({
                host: formData.EmailSMTP.Host,
                port: formData.EmailSMTP.port,
                secure: true, // Use secure SSL connection
                auth: {
                    user: formData.EmailSMTP.Email,
                    pass: formData.EmailSMTP.Password,
                },
            });

            const clientTemplatePath = "./views/email/thanks_email_client.ejs";

            // Render client thank you email template
            const clientEmailHTML = await ejs.renderFile(clientTemplatePath, { Udata: formData });

            const mainOptions = {
                from: `"${formData.EmailSMTP.fromName}" <${formData.EmailSMTP.EmailCopy}>`,
                to: `${formData.messageBody.EmailCopy}`,
                cc: `${formData.EmailSMTP.Email}`,
                subject: "Thank you for contacting us",
                html: clientEmailHTML
            };

            // Send email using transporter
            await transporter.sendMail(mainOptions);
            return cb({ Status: "Suc", Msg: "Client Email Sent" });
        } catch (err) {
            console.error("Error sending client email:", err);
            return cb({ Status: "err", Msg: "Error Sending Client Email" });
        }
    }

    // Sends thank you email to admin
    async sendemailfromcontactus(formData, cb) {
        try {
            // Send email to client and cc to us
            await this.sendemailtous(formData, async (response) => {
                if (response.Status === "err") {
                    return cb(response);
                }

                // Configure the transporter dynamically
                const transporter = nodemailer.createTransport({
                    host: formData.EmailSMTP.Host,
                    port: formData.EmailSMTP.port,
                    secure: true, // Use secure SSL connection
                    auth: {
                        user: formData.EmailSMTP.Email,
                        pass: formData.EmailSMTP.Password,
                    },
                });

                // Render admin thank you email template
                const adminTemplatePath = "./views/email/thanks_me.ejs";
                const adminEmailHTML = await ejs.renderFile(adminTemplatePath, { Udata: formData });

                const mainOptions = {
                    from: `"${formData.EmailSMTP.fromName}" <${formData.EmailSMTP.EmailCopy}>`,
                    to: formData.EmailSMTP.EmailCopy,
                    subject: formData.EmailSMTP.Subject,
                    html: adminEmailHTML
                };

                // Send email using transporter
                await transporter.sendMail(mainOptions);
                return cb({ Status: "Suc", Msg: "Admin Email Sent" });
            });
        } catch (err) {
            console.error("Error sending admin email:", err);
            return cb({ Status: "err", Msg: "Error Sending Admin Email" });
        }
    }

}

module.exports = EmailSent;