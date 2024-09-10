const mongoose = require('mongoose');

// Define the nested schema for location
const LocationSchema = new mongoose.Schema({
    range: [Number],
    country: String,
    region: String,
    eu: String,
    timezone: String,
    city: String,
    ll: [Number],
    metro: Number,
    area: Number
});

// Define the nested schema for session
const SessionSchema = new mongoose.Schema({
    cookie: {
        path: String,
        _expires: Date
    }
});

// Define the nested schema for user agent info
const UserAgentInfoSchema = new mongoose.Schema({
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
});

// Define the main schema
const UserAgentDataSchema = new mongoose.Schema({
    ip: String,
    UID: String,
    location: LocationSchema, // Use the nested schema for location
    previousUrl: String,
    currentUrl: String,
    timeOfVisit: Date,
    sessionID: String,
    session: SessionSchema, // Use the nested schema for session
    userAgentInfo: UserAgentInfoSchema // Use the nested schema for user agent info
});

// Exports Module Functions
module.exports = mongoose.model('Site_user_agent', UserAgentDataSchema);