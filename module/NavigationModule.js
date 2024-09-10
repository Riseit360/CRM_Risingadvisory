// Import mongoose package
const mongoose = require('mongoose');

// Define Page schema
const NavigationSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Menu_Name: {
        type: String,
        required: true
    },
    Menu_Json: {
        type: String, // This will store the JSON string of the menu structure
        required: true
    },
    Visibility: {
        type: String,
        enum: ['Public', 'Private', 'Draft'],
        required: true
    },
    Visibility_Date: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Date,
        default: Date.now
    }
});

// Create and export Page model
module.exports = Navigation = mongoose.model('Navigation', NavigationSchema);