// packages & file import
const mongoose = require('mongoose');

// Schema For Log
const VisitedUrlSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String,
        required: true
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
    },
    requestDetails: {
        ip: String,
        previousUrl: String,
        currentUrl: String,
        timeOfVisit: String,
        sessionID: String,
        session: {
            cookie: {
                path: String,
                _expires: Date
            }
        },
        userAgentInfo: {
            browser: String,
            version: String,
            os: String,
            platform: String,
            source: String,
            is: {
                isMobile: Boolean,
                isTablet: Boolean,
                isDesktop: Boolean,
                isAndroid: Boolean,
                isMac: Boolean
            }
        }
    }
});

// Exports Module Functions
module.exports = mongoose.model('visited_url', VisitedUrlSchema);