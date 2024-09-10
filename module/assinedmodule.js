// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const AssignedUserSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Department: {
        type: String
    },
    Department_Head: {
        type: String
    },
    User_To: {
        type: [String]
    },
    Assign: {
        type: [String]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Date,
        default: Date.now
    }
});
// Exports Module Functions
module.exports = Assigned_User = mongoose.model('Assigned_User', AssignedUserSchema);