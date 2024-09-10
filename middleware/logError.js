// packages import
var express = require('express');


// Import File & Funtions
const LogErrorModule = require("../module/logErrorModule")
const HttpStatusCodes = require('../HttpsStatusCode/HttpsStatusCode');


// Funtions Class For Body Component
class errorLogger {
    async requireAuth(err, req, res, next) {
        try {

            // Log error to console
            console.error('Error:', error);



            // Send error response to the client
            res.status(HttpStatusCodes.Internal_Server_Error).json({ error: 'Internal Server Error' });

        } catch (error) {
            console.log('Error in BodyComponent middleware:', error);
            res.status(HttpStatusCodes.Internal_Server_Error).json({ error: 'Internal Server Error' });
        }
    }

}





// Export Methord and Funtions
module.exports = errorLogger;