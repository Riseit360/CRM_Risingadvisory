// Express Rout module import 
var express = require('express');
var uuid = require("uuid");

// File and Functions import  
var paginateData = require('../../helper/pagination');
var PageModule = require('../../module/pagesmodule');

// Class for All Functions
class PagesApi {

    // Method to add a new page 
    async addPage(data, userTrackUID, imagePath, cb) {
        try {
            // Create a new page object
            const newPage = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: userTrackUID,
                Title: data.Page_Title,
                Content: data.Content,
                slug: data.URL_handle,
                Visibility: data.Visibility,
                visibility_Date: data.Visibilitydate,
                Featured_Image: imagePath
            };

            // Save the new page to the database
            const savedPage = new PageModule(newPage);
            await savedPage.save();

            return cb(null, { Status: "ok", Msg: "Page saved successfully", data: savedPage });

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
    async getAllPages(page, pageSize, cb) {
        try {

            const PagesList = await paginateData(PageModule, page, pageSize, { Date: -1 });

            if (PagesList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "PagesList found",
                    data: PagesList.data,
                    totalPages: PagesList.totalPages,
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
            const deletedPage = await PageModule.deleteOne({ U_URl_ID: UrlId });

            if (deletedPage.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Page deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Page not found or not deleted" });
            }

        } catch (err) {
            console.error("Error Deleting Page:", err);
            return cb({ Status: "err", Msg: "Error deleting data", data: err });
        }
    }

    // Data GEt all List
    async getPagesData() {
        try {
            const PagesData = await PageModule.find();
            return { status: 'success', data: PagesData };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Pages status
    async Pagestatus(UrlId, cb) {
        try {
            // Find the MetaTag by U_URl_ID
            const statusPages = await PageModule.findOne({ U_URl_ID: UrlId });

            if (!statusPages) {
                return cb({ Status: "err", Message: "MetaTag not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusPages.isActive;
            await PageModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "MetaTag status updated successfully." });

        } catch (err) {
            console.error("Error updating MetaTag status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Find A Pages
    async updatePages(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const updatePageData = await PageModule.findOne({ U_URl_ID: UrlId });

            if (!updatePageData) {
                // User not found
                return cb({ Status: "err", Msg: "Pages not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "Page data retrieved successfully", data: updatePageData });
        } catch (error) {

            console.error("Error retrieving Pages data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Pages data", data: null });
        }
    }

    // Update Pages Data
    async updatePagesData(UrlId, data, imagePath, UserTRackUID, callback) {
        try {
            // Input Value Save
            const updatepage = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Title: data.Page_Title,
                Content: data.Content,
                slug: data.URL_handle,
                Visibility: data.Visibility,
                visibility_Date: data.Visibilitydate,
                Featured_Image: imagePath
            };

            // Update the Pages in the database
            const result = await PageModule.findOneAndUpdate({ U_URl_ID: UrlId }, updatepage, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Pages updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "Pages not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating Pages:", error);
            return callback({ Status: "fail", Msg: "Error updating Pages: " + error.message });
        }
    }


}

module.exports = PagesApi;