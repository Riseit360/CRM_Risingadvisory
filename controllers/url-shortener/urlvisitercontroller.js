// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var visiterModule = require('../../module/url-shortener/VisitedUrl');
var paginateData = require('../../helper/pagination');

class URLvisiterApi {

    // Visiter Data List of URLs 
    async URl_Visiter_data(page, pageSize, cb) {
        try {
            const urls = await paginateData(visiterModule, page, pageSize, { Date: -1 });

            if (urls.Status === "suc") {
                return cb({ Status: "suc", Msg: "URLs found", data: urls.data, totalPages: urls.totalPages, currentPage: page, pageSize });
            } else {
                return cb({ Status: "err", Msg: "No data found", data: [], totalPages: 0, currentPage: page, pageSize });
            }
        } catch (err) {
            console.error("Error fetching URLs:", err);
            return cb({ Status: "err", Msg: "Error checking Data", data: err });
        }
    }

    // Visiter Data List of URLs 
    async URl_Visiter_Download(cb) {

        try {
            const urls = await visiterModule.find({}).sort({ Date: -1 });
            if (urls.length === 0) {
                return cb({ Status: "err", Msg: "No data is there", data: [] });
            } else {
                return cb({ Status: "suc", Msg: "URLs found", data: urls });
            }
        } catch (err) {
            console.error("Error fetching URLs:", err);
            return cb({ Status: "err", Msg: "Error checking Data", data: err });
        }
    }

    // Diltered list of URLs 
    async URl_visiter_filter(startDate, page, pageSize, cb) {
        try {

            //  start date using moment
            const start = moment.utc(startDate).startOf('day').toDate();
            const end = moment.utc(startDate).endOf('day').toDate();


            // Define filter with start and end date
            const filter = {
                Date: {
                    $gte: start,
                    $lt: end
                }
            };

            // Total count of filtered records
            const totalRecords = await visiterModule.countDocuments(filter);
            const totalPages = Math.ceil(totalRecords / pageSize);

            // Calculate skip value for pagination
            const skip = (page - 1) * pageSize;

            // Fetch the filtered, paginated, and sorted data
            const urls = await visiterModule.find(filter)
                .sort({ Date: -1 })
                .skip(skip)
                .limit(pageSize);


            // Check if data is found
            if (urls.length === 0) {
                return cb({ Status: "sucnodata", Msg: "No data found", Data: null, totalPages, currentPage: page, pageSize });
            } else {
                return cb({ Status: "suc", Msg: "URLs found", Data: urls, totalPages, currentPage: page, pageSize });
            }
        } catch (err) {
            console.error("Error fetching URLs:", err);
            return cb({ Status: "error", Msg: "Error fetching data", Data: null, totalPages, currentPage: page, pageSize });
        }
    }

    // Filtered list of URLs Data Download 
    URl_Visiter_filter_data_download(startDate) {
        return new Promise(async (resolve, reject) => {
            try {
                // Parse the start date using moment
                const start = moment.utc(startDate).startOf('day').toDate();
                const end = moment.utc(startDate).endOf('day').toDate();

                // Define filter criteria with start and end date
                const filter = {
                    Date: {
                        $gte: start,
                        $lt: end
                    }
                };

                // Fetch the filtered data
                const urls = await visiterModule.find(filter).sort({ Date: -1 }).exec();

                // Check if data is found
                if (urls.length === 0) {
                    resolve({ Status: "sucnodata", Msg: "No data found", Data: null });
                } else {
                    resolve({ Status: "suc", Msg: "URLs found", Data: urls });
                }
            } catch (err) {
                console.error("Error fetching URLs:", err);
                reject({ Status: "error", Msg: "Error fetching data", Data: null });
            }
        });
    }


}

module.exports = URLvisiterApi;