const mongoose = require('mongoose');
const uuid = require('uuid');

// Define a nested schema for Address
const AddressSchema = new mongoose.Schema({
    Address: {
        type: String
    },
    City: {
        type: String
    },
    State: {
        type: String
    },
    Country: {
        type: String
    },
});

// Main Schema for MetaTag
const MetaTagSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String,
    },
    UserAgentID: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true,
        text: true
    },
    Description: {
        type: String,
        text: true
    },
    Keywords: {
        type: [String]
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    Subject: {
        type: String,
        text: true
    },
    Featured_Image: {
        type: String
    },
    Copyright: {
        type: String
    },
    Robots: {
        type: String,
        default: 'index,follow'
    },
    Author: {
        type: String,
        text: true
    },
    Geo_Position: {
        type: String
    },
    Address: {
        type: AddressSchema
    },
    City: {
        type: String
    },
    State: {
        type: String
    },
    Country: {
        type: String
    },
    Majestic_Site_Verification: {
        type: String
    },
    DMCA_Site_Verification: {
        type: String
    },
    Google_Site_Verification: {
        type: String
    },
    OG_Title: {
        type: String
    },
    OG_Description: {
        type: String
    },
    Domain: {
        type: String,
        index: true
    },
    Summary_Large_Image: {
        type: String
    },
    Page_Name: {
        type: String,
        required: true
    },
    Visibility: {
        type: String,
        enum: ['Public', 'Private', 'Draft'],
        required: true
    },
    Visibility_Date: {
        type: Date
    },
    Pages: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Handle Duplicate Key Errors
MetaTagSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Duplicate key error: URL handle must be unique'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('MetaTag', MetaTagSchema);