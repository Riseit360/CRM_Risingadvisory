// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const SignUpSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    Iam: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Name: {
        type: String,
        required: true,
    },
    Mobile_Number: {
        type: Number,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Email_Id: {
        type: String,
        required: true,
    },
    AgreePolicy: {
        type: String
    },
    OTP: {
        type: Number
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
module.exports = signup = mongoose.model('signup', SignUpSchema);