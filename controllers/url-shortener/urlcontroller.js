// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var UrlModule = require('../../module/url-shortener/UrlModule');
var paginateData = require('../../helper/pagination');

class URLshortenerApi {

    // save URL post Data Save
    async URl_Shortener(longURL, shortURL, cb) {
        try {
            //  Input Value Save 
            const UrlShort = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                long_URL: longURL,
                short_URL: shortURL
            };

            // Save to Database
            const URlsave = new UrlModule(UrlShort);
            await URlsave.save();

            console.log("🚀 ~ file: urlcontroller.js:29 ~ URLshortenerApi ~ URl_Shortener ~ URlsave:", URlsave)

            return cb({ Status: "suc", Msg: "URL saved successfully" });

        } catch (error) {
            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving URL" });
        }
    }

    // Save BulkShortener URl list  
    async URl_BulkShortener(originalURL, shortURL, cb) {
        try {
            //  Input Value Save 
            const urlsShort = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                long_URL: originalURL,
                short_URL: shortURL
            };

            // Save to Database
            const urlsSave = new UrlModule(urlsShort);
            await urlsSave.save();

            return cb({ Status: "suc", Msg: "URL saved successfully" });

        } catch (error) {
            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving URL" });
        }
    }

    // Find All List Of data URLs with pagination
    async URl_Shortener_data(page, pageSize, cb) {
        try {
            const urls = await paginateData(UrlModule, page, pageSize, { Date: -1 });

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

    // Data Download All List of URLs
    async URl_ShortDonload_data(cb) {

        try {
            const urls = await UrlModule.find({}).sort({ Date: -1 });
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

    // Short to long Url original path redirect
    async getOriginalUrl(shortID, cb) {
        try {
            const urlData = await UrlModule.findOne({ short_URL: { $regex: shortID, $options: 'i' } });
            if (urlData) {
                return cb({ Status: 'suc', originalURL: urlData.long_URL });
            } else {
                return cb({ Status: 'err', Msg: 'URL not found' });
            }
        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }

    // Delete Url list Data in one by one
    async URlShortDelete(UrlId, cb) {
        try {
            // Match Nad delete URl List
            const deleteURlData = await UrlModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteURlData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Blog post deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Blog post not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }

    // Diltered list of URLs 
    async URl_Shortener_filter(startDate, page, pageSize, cb) {
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
            const totalRecords = await UrlModule.countDocuments(filter);
            const totalPages = Math.ceil(totalRecords / pageSize);

            // Calculate skip value for pagination
            const skip = (page - 1) * pageSize;

            // Fetch the filtered, paginated, and sorted data
            const urls = await UrlModule.find(filter)
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
    async URl_Short_filter_data(startDate, cb) {
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
            const urls = await UrlModule.find(filter).sort({ Date: -1 }).exec();
            console.log("🚀 ~ file: urlcontroller.js:184 ~ URLshortenerApi ~ URl_Short_filter_data ~ urls:", urls)

            // Check if data is found
            if (urls.length === 0) {
                return cb({ Status: "sucnodata", Msg: "No data found", Data: null });
            } else {
                return cb({ Status: "suc", Msg: "URLs found", Data: urls });
            }
        } catch (err) {
            console.error("Error fetching URLs:", err);
            return cb({ Status: "error", Msg: "Error fetching data", Data: null });
        }
    }


}

module.exports = URLshortenerApi;