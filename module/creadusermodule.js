// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const credUserSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true
    },
    Mobile_Number: {
        type: Number,
        required: true
    },
    OTP: {
        type: Number
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    Date: {
        type: Date,
        default: Date.now
    },
    addon: {
        U_URl_ID: {
            type: String
        },
        UserAgentID: {
            type: String
        },
        PAN_Card_Number: {
            type: String,
            default: "Pending"
        },
        Aadhar_Card_Number: {
            type: String,
            default: "Pending"
        },
        User_Id: {
            type: String,
            default: "Pending"
        },
        Password: {
            type: String,
            default: "Pending"
        },
        City: {
            type: String,
            default: "Pending"
        },
        Zip_Code: {
            type: String
        },
        Address: {
            type: String,
            default: "Pending"
        },
        createdBy: {
            type: Date,
            default: Date.now
        }
    },
    AssignedTo: {
        U_URl_ID: {
            type: String
        },
        UserAgentID: {
            type: String
        },
        User_To: {
            type: [String]
        },
        createdBy: {
            type: Date,
            default: Date.now
        }
    }

}, { timestamps: true });

// Exports Module Functions
module.exports = cread_user = mongoose.model('cread_user', credUserSchema);