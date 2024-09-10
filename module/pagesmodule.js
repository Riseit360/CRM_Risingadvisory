// Import mongoose package
const mongoose = require('mongoose');

// Define Page schema
const PageSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Title: {
        type: String,
        required: true,
        trim: true
    },
    Content: {
        type: String
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    Visibility: {
        type: String,
        enum: ['Public', 'Private', 'Draft'],
        required: true
    },
    visibility_Date: {
        type: Date,
        default: Date.now
    },
    Featured_Image: {
        type: String
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
module.exports = Page = mongoose.model('Page', PageSchema);