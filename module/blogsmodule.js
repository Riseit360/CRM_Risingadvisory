// Import mongoose package
const mongoose = require('mongoose');

// Define Page schema
const BlogsSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String
    },
    UserAgentID: {
        type: String
    },
    Title: {
        type: String
    },
    Short_Content: {
        type: String
    },
    Content: {
        type: String
    },
    slug: {
        type: String
    },
    Visibility: {
        type: String,
        enum: ['Public', 'Private', 'Draft']
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
module.exports = Blogs = mongoose.model('Blogs', BlogsSchema);