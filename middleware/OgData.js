// Express Rout module import 
var express = require("express");
var app = express();


// Funtion OG Data
function getogdata(OgData, page) {
    try {

        // Check if OgData is an array and has elements
        if (!Array.isArray(OgData) || OgData.length === 0) {
            throw new Error('OgData is not in the expected format');
        }

        // Find the OG data for the given page
        let ogdata = null;
        for (const data of OgData) {
            if (Array.isArray(data.Pages) && data.Pages.includes(page)) {
                ogdata = data;
                break; // Stop looping once the page is found
            }
        }

        // Save and Back
        return ogdata;

    } catch (error) {
        console.error('Error in OgData middleware:', error);
    }
}


// Export Methods & Funtions
module.exports = {
    getogdata: getogdata
};