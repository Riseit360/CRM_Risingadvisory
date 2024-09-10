// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var RolesModule = require('../../module/RolesModule');
var PermissionsModule = require('../../module/PermissionsModule');
var paginateData = require('../../helper/pagination');

class PermissionsApi {

    async addPermissions(data, UserTRackUID, cb) {
        try {

            // Find the Role by its Name
            const role = await RolesModule.findOne({ Name: data.Role });
            console.log("🚀 ~ file: PermissionsControllers.js:18 ~ PermissionsApi ~ addPermissions ~ role:", role)

            if (!role) {
                return cb({ Status: "err", Msg: "Role not found" });
            }


            // Data Object
            const PermissionsData = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Name: data.User_Name,
                RoleID: role._id,
                Roles: data.Role,
                Actions: data.Permissions_Actions
            }
            console.log("🚀 ~ file: PermissionsControllers.js:33 ~ PermissionsApi ~ addPermissions ~ PermissionsData:", PermissionsData)

            // data Send In databased
            const PermissionsSave = new PermissionsModule(PermissionsData);
            console.log("🚀 ~ file: PermissionsControllers.js:37 ~ PermissionsApi ~ addPermissions ~ PermissionsSave:", PermissionsSave)
            await PermissionsSave.save();

            // Return Massges
            return cb({ Status: "suc", Msg: "Roles saved successfully" });
        } catch (error) {
            console.error("Error saving Roles:", error);
            return cb({ Status: "err", Msg: "Error while saving Roles" });
        }


    }

    // All List of Roles Data
    async PermissionsListData(page, pageSize, cb) {
        try {
            const PermissionsList = await paginateData(PermissionsModule, page, pageSize, { Date: -1 });

            if (PermissionsList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "DataList found",
                    data: PermissionsList.data,
                    totalPages: PermissionsList.totalPages,
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
            console.error("Error fetching Permissions List:", err);
            return cb({ Status: "err", Msg: "Error checking Permissions List Data", data: err });
        }
    }

    // Data GEt 
    async getPermissionsListData() {
        try {
            const PermissionsApiData = await PermissionsModule.find();
            return { status: 'success', data: PermissionsApiData };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Update For Statues
    async PermissionsStatus(UrlId, cb) {
        try {
            // Find the Department by U_URl_ID
            const PermissionsRoles = await PermissionsModule.findOne({ U_URl_ID: UrlId });

            if (!PermissionsRoles) {
                return cb({ Status: "err", Message: "Permissions not found." });
            }

            // Toggle the isActive status
            const newStatus = !PermissionsRoles.isActive;
            await PermissionsModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "Permissions status updated successfully." });

        } catch (err) {
            console.error("Error updating Permissions status:", err);
            return cb({ Status: "err", Message: "Error updating Permissions data", data: err });
        }
    }

    // Delete Roles Data in one by one
    async PermissionsDelete(UrlId, cb) {
        try {
            // Match and delete URl List
            const deletePermissionsData = await PermissionsModule.deleteOne({ U_URl_ID: UrlId });

            if (deletePermissionsData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Permissions deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Permissions not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original Permissions:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original Permissions' });
        }
    }

    // Find A Roles
    async updatePermissions(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const PermissionsData = await PermissionsModule.findOne({ U_URl_ID: UrlId });

            if (!PermissionsData) {
                // User not found
                return cb({ Status: "err", Msg: "Permissions not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "Permissions data retrieved successfully", data: PermissionsData });
        } catch (error) {

            console.error("Error retrieving Permissions data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Permissions data", data: null });
        }
    }

    // Update Roles Data
    // Update Roles Data
    async UpdatePermissionsData(UrlId, data, UserTRackUID, callback) {
        try {
            // Find the Role by its Name
            const role = await RolesModule.findOne({ Name: data.Role });

            if (!role) {
                return callback({ Status: "err", Msg: "Role not found" });
            }

            // Input Value Save
            const UpdatePerList = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Name: data.User_Name,
                RoleID: role._id,
                Actions: data.Permissions_Actions
            };

            // Update the user data in the database
            const result = await PermissionsModule.findOneAndUpdate({ U_URl_ID: UrlId }, UpdatePerList, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Permissions updated successfully." }); // changed 'Suc' to 'suc'
            } else {
                return callback({ Status: "fail", Msg: "Permissions not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating Permissions:", error);
            return callback({ Status: "fail", Msg: "Error updating Permissions: " + error.message });
        }
    }

}

module.exports = PermissionsApi;