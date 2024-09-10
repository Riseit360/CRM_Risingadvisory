// packages & file import
const mongoose = require('mongoose');


// Schema For Log
const urlSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String,
        required: true,
        unique: true
    },
    long_URL: {
        type: String,
        required: true
    },
    short_URL: {
        type: String,
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

// Exports Module Funtions
module.exports = URL = mongoose.model('URL', urlSchema);