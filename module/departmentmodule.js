// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const DepartmentSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String
    },
    Mobile_Number: {
        type: Number
    },
    Head: {
        type: String,
        required: true,
    },
    location: {
        type: String
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
module.exports = department = mongoose.model('department', DepartmentSchema);