// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const UserSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Employment_ID: {
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
        type: Number
    },
    Department: {
        type: String
    },
    Department_head: {
        type: String
    },
    Job_Profile_Post: {
        type: String
    },
    Job_Profile: {
        type: String
    },
    Acount: {
        type: String,
        enum: ['Admin', 'TeamLead', 'Operation', 'Sale'],
        required: true
    },
    Password: {
        type: String,
        required: true,
    },

    isActive: {
        type: Boolean,
        default: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

// Exports Module Functions
module.exports = user = mongoose.model('user', UserSchema);