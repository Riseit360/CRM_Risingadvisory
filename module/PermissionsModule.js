// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const PermissionSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Name: {
        type: [String],
        required: true
    },
    Roles: {
        type: String,
        required: true
    },
    RoleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles', // Reference to Roles collection
        required: true
    },
    Actions: {
        type: [String], // Array of actions like ['create', 'read', 'update', 'delete']
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
module.exports = Permissions = mongoose.model('Permissions', PermissionSchema);