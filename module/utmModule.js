// Import mongoose package
const mongoose = require('mongoose');

// Define UTM schema
const utmSchema = new mongoose.Schema({
    utm_source: {
        type: String,
        default: null
    },
    utm_medium: {
        type: String,
        default: null
    },
    utm_campaign: {
        type: String,
        default: null
    },
    utm_term: {
        type: String,
        default: null
    },
    utm_content: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export UTM model
module.exports = mongoose.model('UTM', utmSchema);