// Express Rout module import 
var express = require('express');
var uuid = require("uuid");

// File and Functions import  
var paginateData = require('../../helper/pagination');
var SeoToolModule = require('../../module/seotoolmodule');

// Class for All Functions
class SEO_Tool_Api {


    // Method to Save MetaTag
    async saveMetatag(data, userTrackUID, imagePath, cb) {
        try {
            // Create a Meta Tag object
            const MetaTag = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: userTrackUID,
                Title: data.Title,
                Description: data.description,
                Keywords: data.keywords,
                slug: data.URLS_handle,
                Subject: data.subject,
                Featured_Image: imagePath,
                Copyright: data.copyright,
                Robots: data.robots,
                Author: data.author,
                Geo_Position: data.GeoPosition,
                Address: {
                    Address: data.address,
                    City: data.city,
                    State: data.state,
                    Country: data.country
                },
                country: data.country,
                Majestic_Site_Verification: data.majestic_site_verification,
                DMCA_Site_Verification: data.dmca_site_verification,
                Google_Site_Verification: data.google_site_verification,
                OG_Title: data.og_title,
                OG_Description: data.og_description,
                Domain: data.domain,
                Summary_Large_Image: data.summary_large_image,
                Page_Name: data.pagename,
                Visibility: data.visibility,
                Visibility_Date: data.visibility_date,
                Pages: data.page
            };

            // Save the Meta Tag to the database
            const savedMetaTag = new SeoToolModule(MetaTag);
            await savedMetaTag.save();

            return cb(null, { Status: "ok", Msg: "Page saved successfully", data: savedMetaTag });

        } catch (err) {
            if (err.code === 11000) {
                console.error("Duplicate key error:", err);
                return cb({ Status: "err", Msg: "Duplicate key error: URL handle must be unique", data: err });
            } else {
                console.error("Error saving page:", err);
                return cb({ Status: "err", Msg: "Error saving data", data: err });
            }
        }
    }

    // Method to get all pages with pagination
    async getAllMetaTag(page, pageSize, cb) {
        try {

            const MetaTagList = await paginateData(SeoToolModule, page, pageSize, { Date: -1 });

            if (MetaTagList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "PagesList found",
                    data: MetaTagList.data,
                    totalPages: MetaTagList.totalPages,
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
            console.error("Error Retrieving Pages:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }

    // Method to delete a page by ID
    async deletePage(UrlId, cb) {
        try {
            // Id to delete data
            const deletedMetaTag = await SeoToolModule.deleteOne({ U_URl_ID: UrlId });

            if (deletedMetaTag.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Meta Tag deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Meta Tag not found or not deleted" });
            }

        } catch (err) {
            console.error("Error Deleting Page:", err);
            return cb({ Status: "err", Msg: "Error deleting data", data: err });
        }
    }

    // Method Status
    async MetaTagStatus(UrlId, cb) {
        try {
            // Find the MetaTag by U_URl_ID
            const statusMetaTag = await SeoToolModule.findOne({ U_URl_ID: UrlId });

            if (!statusMetaTag) {
                return cb({ Status: "err", Message: "MetaTag not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusMetaTag.isActive;
            await SeoToolModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "MetaTag status updated successfully." });

        } catch (err) {
            console.error("Error updating MetaTag status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Method to download Meta Tag data
    async MetaTagDownload() {
        try {
            // Find all Meta Tags sorted by Date in descending order
            const metaTagData = await SeoToolModule.find({}).sort({ Date: -1 });

            // Check if any Meta Tag data is found
            if (metaTagData.length === 0) {
                return { Status: "err", Msg: "No Meta Tag data found", data: [] };
            } else {
                return { Status: "suc", Msg: "Meta Tag data found", data: metaTagData };
            }

        } catch (err) {
            console.error("Error fetching Meta Tag data:", err);
            return { Status: "err", Msg: "Error fetching Meta Tag data", data: err };
        }
    }

    // Find A Pages For Update
    async updateSeoMetaTag(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const updateSeoData = await SeoToolModule.findOne({ U_URl_ID: UrlId });

            if (!updateSeoData) {
                // User not found
                return cb({ Status: "err", Msg: "SEO Meta not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "SEO Meta data retrieved successfully", data: updateSeoData });
        } catch (error) {

            console.error("Error retrieving SEO Meta data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Pages data", data: null });
        }
    }

    // Update Pages Data
    async UpdateNewMetatag(UrlId, data, UserTRackUID, imagePath, callback) {
        try {
            // Input Value Save
            const updateNewMetaData = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Title: data.Title,
                Description: data.description,
                Keywords: data.keywords,
                slug: data.URLS_handle,
                Subject: data.subject,
                Featured_Image: imagePath,
                Copyright: data.copyright,
                Robots: data.robots,
                Author: data.author,
                Geo_Position: data.GeoPosition,
                Address: {
                    Address: data.address,
                    City: data.city,
                    State: data.state,
                    Country: data.country
                },
                country: data.country,
                Majestic_Site_Verification: data.majestic_site_verification,
                DMCA_Site_Verification: data.dmca_site_verification,
                Google_Site_Verification: data.google_site_verification,
                OG_Title: data.og_title,
                OG_Description: data.og_description,
                Domain: data.domain,
                Summary_Large_Image: data.summary_large_image,
                Page_Name: data.pagename,
                Visibility: data.visibility,
                Visibility_Date: data.visibility_date,
                Pages: data.page
            };

            // Update the Pages in the database
            const result = await SeoToolModule.findOneAndUpdate({ U_URl_ID: UrlId }, updateNewMetaData, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "MetaTag updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "MetaTag not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating Pages:", error);
            return callback({ Status: "fail", Msg: "Error updating MetaTag: " + error.message });
        }
    }

}

module.exports = SEO_Tool_Api;