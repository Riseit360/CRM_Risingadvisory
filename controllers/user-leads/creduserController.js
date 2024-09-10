// Express Route module import 
const express = require('express');
const uuid = require('uuid');
const axios = require('axios');

// File Controller for storing 
var paginateData = require('../../helper/pagination');
const CreadUserModule = require('../../module/creadusermodule');
const AssignedUserModule = require('../../module/assinedmodule');


// Class Funtions 
class CredUserApi {

    // Method to get all User with pagination
    async LeadsListData(page, pageSize, cb) {
        try {

            const UsersList = await paginateData(CreadUserModule, page, pageSize, { Date: -1 });

            if (UsersList.Status === "suc") {
                return cb({ Status: "suc", Msg: "Users Leads found", data: UsersList.data, totalPages: UsersList.totalPages, currentPage: page, pageSize });
            } else {
                return cb({ Status: "err", Msg: "No data found", data: [], totalPages: 0, currentPage: page, pageSize });
            }

        } catch (err) {
            console.error("Error Retrieving User Leads:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }

    // Feedback Update User Data
    async UpdateUserLeads(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const feedbackeData = await CreadUserModule.findOne({ U_URl_ID: UrlId });

            if (!feedbackeData) {
                // User not found
                return cb({ Status: "err", Msg: "User not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "User data retrieved successfully", data: feedbackeData });
        } catch (error) {

            console.error("Error retrieving User data:", error);
            return cb({ Status: "err", Msg: "Error retrieving User data", data: null });
        }
    }

    // Update Leads Data
    async UpdateAddonDetails(UrlId, data, UserTRackUID, callback) {
        try {
            // Input Value Save
            const updateLeads = {
                addon: {
                    U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                    UserAgentID: UserTRackUID,
                    PAN_Card_Number: data.PanNo,
                    Aadhar_Card_Number: data.AadharNo,
                    User_Id: data.userID,
                    Password: data.Password,
                    City: data.city,
                    Zip_Code: data.zipcode,
                    Address: data.Address
                }
            };

            // Update the Pages in the database
            const result = await CreadUserModule.findOneAndUpdate({ U_URl_ID: UrlId }, updateLeads, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Leads Data updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "Leads Data not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating LEads:", error);
            return callback({ Status: "fail", Msg: "Error updating Leads: " + error.message });
        }
    }

    // Refer Data For List
    async ReferLeadsList() {
        try {
            const UserLeadsData = await CreadUserModule.find();
            return { status: 'success', data: UserLeadsData };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Assign Leads Data
    async AssignLead(data, UserTRackUID, callback) {
        try {
            // Generate a unique U_URl_ID
            const uniqueUUrlID = uuid.v4().replace(/-/g, "").substring(0, 12);
            console.log("Generated U_URl_ID:", uniqueUUrlID); // Debugging

            // Check if `data` is valid
            if (!data || !data.Assign || !Array.isArray(data.Assign)) {
                console.error("Invalid data format or 'Assign' is not an array");
                return callback({ Status: "fail", Msg: "Invalid data format or 'Assign' is not an array." });
            }

            // Create new record in AssignedUserModule
            const assignedLead = {
                U_URl_ID: uniqueUUrlID,
                UserAgentID: UserTRackUID,
                Department: data.department,
                Department_Head: data.department_head,
                User_To: data.User_Name,
                Assign: data.Assign
            };
            console.log("Assigned Lead Data:", assignedLead); // Debugging

            // Save assigned lead record
            const savedAssignLead = new AssignedUserModule(assignedLead);
            await savedAssignLead.save();

            // Check if Assign is an array
            const emails = data.Assign;

            console.log("Emails to update:", emails); // Debugging

            // Update users in CreadUserModule with the same U_URl_ID
            const updatePromises = emails.map(email => {
                const updateFields = {
                    AssignedTo: {
                        U_URl_ID: uniqueUUrlID,
                        UserAgentID: UserTRackUID,
                        User_To: data.User_Name
                    }
                };

                return CreadUserModule.findOneAndUpdate({ Email: email }, { $set: updateFields }, { new: true }).exec();
            });

            // Wait for all update operations to complete
            const updateResults = await Promise.all(updatePromises);


            // Check if any update failed
            if (updateResults.some(result => result === null)) {
                console.error("Some users could not be updated."); // Debugging
                return callback({ Status: "fail", Msg: "Some users could not be updated." });
            }

            console.log("All users updated successfully"); // Debugging

            if (typeof callback === 'function') {
                return callback(null, { Status: "ok", Msg: "Assign Lead saved and users updated successfully", data: savedAssignLead });
            } else {
                console.error("Callback function is not valid."); // Debugging
                return callback({ Status: "fail", Msg: "Callback function is not valid." });
            }

        } catch (error) {
            console.error("Error Assigning Leads:", error.message); // Debugging the exact error
            return callback({ Status: "fail", Msg: "Error updating Leads: " + error.message });
        }
    }

    // Calling Leads Data
    async CallingListData(UserName, page, pageSize, cb) {
        try {

            // Step 1: Find records in AssignedUserModule based on UserName
            const assignedUsers = await AssignedUserModule.find({ User_To: UserName });

            if (!assignedUsers || assignedUsers.length === 0) {
                return cb({ Status: "err", Msg: "No assigned data found for the given UserName", data: [] });
            }

            // Step 2: Extract the Assign field (emails) from the records
            const emailList = assignedUsers.flatMap(record => record.Assign);

            // Step 3: Find matching records in CreadUserModule based on the emails
            const usersList = await CreadUserModule.find({ Email: { $in: emailList } }).skip((page - 1) * pageSize).limit(pageSize);

            // If no users found
            if (!usersList || usersList.length === 0) {
                return cb({ Status: "err", Msg: "No users found for the provided emails", data: [] });
            }

            // Get the total count of matching users for pagination
            const totalUsers = await CreadUserModule.countDocuments({ Email: { $in: emailList } });

            // Step 4: Return the details
            return cb({ Status: "suc", Msg: "Users details retrieved successfully", data: usersList, totalPages: Math.ceil(totalUsers / pageSize), currentPage: page, pageSize });

        } catch (err) {
            console.error("Error Retrieving User Leads:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }



    }








}

module.exports = CredUserApi;