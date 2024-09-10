// packages & file import
const mongoose = require('mongoose');


// Schema For Log
const ErrorLogSchema = new mongoose.Schema({
    U_ID_Feedback: {
        type: String,
    },
    errorMessage: {
        type: String,
    },
    errorLine: {
        type: String,
    },
    errorCategory: {
        type: String,
    },
    errorFileName: {
        type: String,
    },
    errorFileName: {
        type: String,
    },
    errorURL: {
        type: String,
    },
    Date: {
        type: Date,
        default: Date.now
    }
});

// Exports Module Funtions
module.exports = errorlog = mongoose.model('errorlog', ErrorLogSchema);