// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var DepartmentModule = require('../../module/departmentmodule');
var paginateData = require('../../helper/pagination');

class DepartmentApi {

    // save Department post Data Save
    async saveDepartmentData(data, UserTRackUID, cb) {
        try {
            //  Input Value Save 
            const Department = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Name: data.department_name,
                Email: data.email,
                Mobile_Number: data.contact_number,
                Head: data.department_head,
                location: data.location
            };

            // Save to Database
            const Departmentsave = new DepartmentModule(Department);
            await Departmentsave.save();
            return cb({ Status: "suc", Msg: "URL saved successfully" });

        } catch (error) {
            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving URL" });
        }

    }

    // All List of Department Data
    async DepartmentData(page, pageSize, cb) {
        try {
            const DataList = await paginateData(DepartmentModule, page, pageSize, { Date: -1 });

            if (DataList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "DataList found",
                    data: DataList.data,
                    totalPages: DataList.totalPages,
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
            console.error("Error fetching Data List:", err);
            return cb({ Status: "err", Msg: "Error checking Data", data: err });
        }
    }

    // Data GEt 
    async getDepartmentData() {
        try {
            const departments = await DepartmentModule.find();
            return { status: 'success', data: departments };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Delete Department Data in one by one
    async DepartmentDelete(UrlId, cb) {
        try {
            // Match Nad delete URl List
            const deleteDepartmentData = await DepartmentModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteDepartmentData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Department deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Department not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }

    // Update For Statues
    async DepartmentStatus(UrlId, cb) {
        try {
            // Find the Department by U_URl_ID
            const statusDepartment = await DepartmentModule.findOne({ U_URl_ID: UrlId });

            if (!statusDepartment) {
                return cb({ Status: "err", Message: "Department not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusDepartment.isActive;
            await DepartmentModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "Department status updated successfully." });

        } catch (err) {
            console.error("Error updating Department status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Find A DepartMent
    async updateDepartment(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const DepartData = await DepartmentModule.findOne({ U_URl_ID: UrlId });

            if (!DepartData) {
                // User not found
                return cb({ Status: "err", Msg: "DepartMent not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "DepartMent data retrieved successfully", data: DepartData });
        } catch (error) {

            console.error("Error retrieving user data:", error);
            return cb({ Status: "err", Msg: "Error retrieving DepartMent data", data: null });
        }
    }

    // Update DepartMent Data
    async UpdateDepaData(userId, data, UserTRackUID, callback) {
        try {

            //  Input Value Save 
            const UpdateDepartment = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID.UID,
                Name: data.department_name,
                Email: data.email,
                Mobile_Number: data.contact_number,
                Head: data.department_head,
                location: data.location
            };

            // Update the user data in the database
            const result = await DepartmentModule.findOneAndUpdate({ U_URl_ID: userId }, UpdateDepartment, { new: true });

            if (result) {
                return callback({ Status: "Suc", Msg: "DepartMent updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "DepartMent not found or no changes detected." });
            }


        } catch (error) {
            console.error("Error updating user:", error);
            return callback({ Status: "fail", Msg: "Error updating user: " + error.message });
        }
    }

}

module.exports = DepartmentApi;