// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const RolesSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Name: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    Department_Head: {
        type: String,
        required: true
    },
    Roles: {
        type: String,
        required: true
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
module.exports = Roles = mongoose.model('Roles', RolesSchema);