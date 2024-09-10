// Express Rout module import 
var express = require('express');
var uuid = require("uuid");

// File and Functions import  
var UserAgentModule = require('../../module/agentusermodule');
var SiteUserAgentModule = require('../../module/SiteUserAgentModule');
var paginateData = require('../../helper/pagination');


class UserAgentApi {

    // Method to save user agent data
    async saveUserAgentData(requestData, cb) {
        try {
            const userAgentData = new UserAgentModule(requestData);
            await userAgentData.save();

            // Assuming cb is a callback function passed to handle the response
            return cb({ Status: "suc", Msg: "User agent data saved successfully" });
        } catch (error) {
            console.error("Error saving user agent data:", error);
            return cb({ Status: "err", Msg: "Error while saving user agent data" });
        }
    }


    // Method to get all pages with pagination
    async CRMLogData(page, pageSize, cb) {
        try {

            const CRMLogList = await paginateData(UserAgentModule, page, pageSize, { Date: -1 });

            if (CRMLogList.Status === "suc") {
                return cb({ Status: "suc", Msg: "CRMLogList found", data: CRMLogList.data, totalPages: CRMLogList.totalPages, currentPage: page, pageSize });
            } else {
                return cb({ Status: "err", Msg: "No data found", data: [], totalPages: 0, currentPage: page, pageSize });
            }

        } catch (err) {
            console.error("Error Retrieving CRM LOG:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }

    // Method to get all pages with pagination
    async LogSiteList(page, pageSize, cb) {
        try {

            const SiteLogList = await paginateData(SiteUserAgentModule, page, pageSize, { Date: -1 });

            if (SiteLogList.Status === "suc") {
                return cb({ Status: "suc", Msg: "SiteLogList found", data: SiteLogList.data, totalPages: SiteLogList.totalPages, currentPage: page, pageSize });
            } else {
                return cb({ Status: "err", Msg: "No data found", data: [], totalPages: 0, currentPage: page, pageSize });
            }

        } catch (err) {
            console.error("Error Retrieving Site LOG:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }



}

module.exports = UserAgentApi;