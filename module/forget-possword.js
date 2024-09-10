// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const ForgetPasswordSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    Email_Id: {
        type: String,
        required: true,
    },
    UserAgentID: {
        type: String
    },
    OTP: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    OTP_Expiry: {
        type: Date
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

// Exports Module Functions
module.exports = forget_password = mongoose.model('forget_password', ForgetPasswordSchema);