// Express Route module import 
var express = require('express');
var uuid = require("uuid");

// Controller Code 
const UTMModule = require("../../module/utmModule");
var paginateData = require('../../helper/pagination');


// UTM Tracking
class UTMTrackerApi {

    // Function to save UTM data to the database
    async saveUTMData(req) {
        try {
            //Get UTM data from session
            const utmData = req.session.utm || {};

            // Check if UTM parameters exist
            if (utmData.source || utmData.medium || utmData.campaign || utmData.term || utmData.content) {
                // Create new UTM document
                const newUTM = new UTMModule({
                    utm_source: utmData.source,
                    utm_medium: utmData.medium,
                    utm_campaign: utmData.campaign,
                    utm_term: utmData.term,
                    utm_content: utmData.content,
                });

                // Save the UTM data to the database
                await newUTM.save();
                console.log('UTM Data saved:', newUTM);
            }
        } catch (error) {
            console.error('Error saving UTM data:', error);
        }
    }


    // Method to get all pages with pagination
    async getAllUTMRecords(page, pageSize, cb) {
        try {

            const UTMList = await paginateData(UTMModule, page, pageSize, { Date: -1 });

            if (UTMList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "UTM found",
                    data: UTMList.data,
                    totalPages: UTMList.totalPages,
                    currentPage: page,
                    pageSize
                });
            } else {
                return cb({
                    Status: "err",
                    Msg: "No data found",
                    data: [],
                    totalPages: 0,
                    currentPage: page,
                    pageSize
                });
            }

        } catch (err) {
            console.error("Error Retrieving UTM Data:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }


    // Function to retrieve UTM records by campaign
    async getUTMRecordsByCampaign(campaign) {
        try {
            const records = await UTMModule.find({ utm_campaign: campaign });
            return records;
        } catch (error) {
            console.error('Error retrieving UTM records by campaign:', error);
            throw error;
        }
    }

    // Function to retrieve UTM records by date range
    async getUTMRecordsByDateRange(startDate, endDate) {
        try {
            const records = await UTMModule.find({


                createdAt: {
                    $gte: startDate,
                    $lte: endDate,
                }
            });
            return records;
        } catch (error) {
            console.error('Error retrieving UTM records by date range:', error);
            throw error;
        }
    }
}

// Export the class instance using 'new'
module.exports = new UTMTrackerApi();