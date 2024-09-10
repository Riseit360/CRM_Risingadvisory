// Import Express and crypto modules
const express = require('express');
const crypto = require('crypto');

// Functions Class For OTP Generation
class OtpGenerator {
    async randomOTPGenerator(req, res, next) {
        try {

            // Generate OTP and save it to session
            const OTP = crypto.randomInt(100000, 999999).toString();
            req.session.OTP = OTP;

            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.error('Error in OTP Generator middleware:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // Example method for sending OTP via email (stub)
    async SendEmailOtp(datauser, OTP, callback) {
        try {
            // Your email sending logic here
            console.log(`Sending OTP ${OTP} to user ${datauser.email}`);
            // Simulate async operation with a callback
            callback(null, 'OTP sent successfully');
        } catch (error) {
            console.error('Error sending OTP:', error);
            callback(error, null);
        }
    }
}

// Export the OTP Generator instance
module.exports = new OtpGenerator();