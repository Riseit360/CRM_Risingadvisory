// Express Rout module import 
var express = require('express');


// Funtions Class For Body Component
class BodyComponent {

    async requireAuth(req, res, next) {
        try {

            // Input Body Data 
            req.bodyData = req.body;



            // Proceed to the next middleware or route handler
            next();
        } catch (error) {
            console.log('Error in BodyComponent middleware:', error);
        }
    }

}


// Export the Rout Functions
module.exports = BodyComponent;