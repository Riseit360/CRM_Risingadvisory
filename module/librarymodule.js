const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String,
        required: true
    },
    UserAgentID: {
        type: String
    },
    filename: {
        type: String
    },
    type: {
        type: String
    },
    size: {
        type: Number
    },
    path: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export Media model
module.exports = mongoose.model('Media', MediaSchema);