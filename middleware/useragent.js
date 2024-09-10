// Express middleware imports
const requestIp = require('request-ip');
const useragent = require('express-useragent');
var uuid = require("uuid");
var geoip = require('geoip-lite');


// Controller Code 
const saveUserAgentData = require('../controllers/mid/useragentcontroller');


// Class To object
var UserAgentData = new saveUserAgentData();

// Define middleware class
class UserAgent {
    async analyzely(req, res, next) {
        try {

            // Get client IP address || requestIp.getClientIp(req)
            const clientIp = "122.161.74.210" || req.ip;

            // const clientIp = requestIp.getClientIp(req) || '122.161.74.210';
            const U_URl_ID = uuid.v4().replace("-", "").substring(0, 12);

            // Parse user agent details
            const ua = useragent.parse(req.headers['user-agent']);

            // Get session cookie details
            const cookieDetails = {
                path: req.session.cookie.path,
                _expires: req.session.cookie._expires
            };

            // Get previous URL (referer) and current URL
            const previousUrl = req.get('referer') || 'N/A';
            const currentUrl = req.originalUrl;

            // Get time of visit
            const timeOfVisit = new Date().toISOString();

            // Fetch location data based on IP address
            const Location = geoip.lookup(clientIp);


            // Construct requestData object
            const requestData = {
                ip: clientIp,
                UID: U_URl_ID,
                location: Location,
                previousUrl: previousUrl,
                currentUrl: currentUrl,
                timeOfVisit: timeOfVisit,
                sessionID: req.sessionID,
                session: {
                    cookie: cookieDetails
                },
                userAgentInfo: {
                    browser: ua.browser,
                    version: ua.version,
                    os: ua.os,
                    platform: ua.platform,
                    source: ua.source,
                    is: {
                        isMobile: ua.isMobile,
                        isTablet: ua.isTablet,
                        isDesktop: ua.isDesktop,
                        isAndroid: ua.isAndroid,
                        isMac: ua.isMac
                    }
                }
            };

            // Attach requestData to req object
            req.requestData = requestData;

            // Save user agent data using the provided function
            UserAgentData.saveUserAgentData(requestData, (cb) => {
                if (cb.Status === 'suc') {
                    //console.log("User agent data saved");
                } else {
                    res.status(404).json({ error: "URL not found" });
                }
            });

            // Pass control to the next middleware function
            next();
        } catch (error) {
            // Handle any errors that occur
            console.error("Error in UserAgent middleware:", error);
            next(error);
        }
    }
}

// Export the middleware instance
module.exports = new UserAgent();