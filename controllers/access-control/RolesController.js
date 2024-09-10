// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var RolesModule = require('../../module/RolesModule');
var paginateData = require('../../helper/pagination');

class RolesApi {

    async addRoles(data, UserTRackUID, cb) {
        try {
            // Data Object
            const RolesData = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Name: data.Name,
                Department: data.department,
                Department_Head: data.department_head,
                Navigation: data.Navigation
            }

            // data Send In databased
            const RolesSave = new RolesModule(RolesData);
            await RolesSave.save();

            console.log("🚀 ~ file: RolesController.js:34 ~ RolesApi ~ addRoles ~ RolesSave:", RolesSave)

            // Return Massges
            return cb({ Status: "suc", Msg: "Roles saved successfully" });
        } catch (error) {
            console.error("Error saving Roles:", error);
            return cb({ Status: "err", Msg: "Error while saving Roles" });
        }

    }

    // All List of Roles Data
    async RolesListData(page, pageSize, cb) {
        try {
            const RolesList = await paginateData(RolesModule, page, pageSize, { Date: -1 });

            if (RolesList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "DataList found",
                    data: RolesList.data,
                    totalPages: RolesList.totalPages,
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
            console.error("Error fetching Roles List:", err);
            return cb({ Status: "err", Msg: "Error checking Roles List Data", data: err });
        }
    }

    // Data GEt 
    async getRolesListData() {
        try {
            const RolesDataApi = await RolesModule.find();
            return { status: 'success', data: RolesDataApi };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Update For Statues
    async RolesStatus(UrlId, cb) {
        try {
            // Find the Department by U_URl_ID
            const statusRoles = await RolesModule.findOne({ U_URl_ID: UrlId });

            if (!statusRoles) {
                return cb({ Status: "err", Message: "Roles not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusRoles.isActive;
            await RolesModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "Roles status updated successfully." });

        } catch (err) {
            console.error("Error updating Roles status:", err);
            return cb({ Status: "err", Message: "Error updating Roles data", data: err });
        }
    }

    // Delete Roles Data in one by one
    async RolesDelete(UrlId, cb) {
        try {
            // Match and delete URl List
            const deleteRolesData = await RolesModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteRolesData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Roles deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Roles not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original Roles:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original Roles' });
        }
    }

    // Find A Roles
    async updateRoles(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const RolesData = await RolesModule.findOne({ U_URl_ID: UrlId });

            if (!RolesData) {
                // User not found
                return cb({ Status: "err", Msg: "Roles not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "Roles data retrieved successfully", data: RolesData });
        } catch (error) {

            console.error("Error retrieving user data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Roles data", data: null });
        }
    }

    // Update Roles Data
    async UpdateRolesData(userId, data, UserTRackUID, callback) {
        try {

            //  Input Value Save 
            const UpdateRolesList = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Name: data.Name,
                Department: data.department,
                Department_Head: data.department_head,
                Navigation: data.Navigation
            };

            // Update the user data in the database
            const result = await RolesModule.findOneAndUpdate({ U_URl_ID: userId }, UpdateRolesList, { new: true });

            if (result) {
                return callback({ Status: "Suc", Msg: "Roles updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "Roles not found or no changes detected." });
            }


        } catch (error) {
            console.error("Error updating user:", error);
            return callback({ Status: "fail", Msg: "Error updating user: " + error.message });
        }
    }



}

module.exports = RolesApi;