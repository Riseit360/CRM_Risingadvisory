// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');
const bcrypt = require('bcrypt');

// File and Funtions import 
var UserModule = require('../../module/UserModule');
const HashedGenerator = require('../../helper/hashed')
const config = require("../../config/config.json")
var paginateData = require('../../helper/pagination');


// Class for All Funtions
class SignUpAuthApi {

    // save blog post
    async AddUserData(data, UserTRackUID, cb) {
        try {

            // Get Email & Otp Matched
            const { Password, ConfirmPassword } = data;;

            // Check if password and confirm password match
            if (Password !== ConfirmPassword) {
                return cb({ Status: 'err', Msg: 'Passwords do not match' });
            }

            console.log("JobProfile:", data.JobProfile);

            // Convert JobProfile to its acronym & Cretad a EmploymentId
            const acronym = data.JobProfile
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();

            // Generate a 4-digit random number
            const randomNumber = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
            const EmploymentId = `${config.EmploymentId}${acronym}${randomNumber}`;

            // Convert the data object to a JSON string and Cout the Lenght
            const dataString = JSON.stringify(data);
            const characterCount = dataString.length;

            // Hash the password
            const hashedPassword = await HashedGenerator.hashPassword(data, characterCount);

            //  Input Value Save 
            const UserData = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID.UID,
                Employment_ID: EmploymentId,
                Name: data.Name,
                Email: data.Email,
                Mobile_Number: data.PhoneNumber,
                Department: data.Department,
                Department_head: data.Department_head,
                Job_Profile_Post: data.Job_Profile_Post,
                Job_Profile: data.JobProfile,
                Acount: data.AcountType,
                Password: hashedPassword
            };

            // Save to Database
            const UserSave = new UserModule(UserData);
            await UserSave.save();

            return cb({ Status: "suc", Msg: "User Data saved successfully" });

        } catch (error) {

            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving user data" });
        }

    }

    // All List of Department Data
    async UserListData(page, pageSize, cb) {
        try {
            const DataList = await paginateData(UserModule, page, pageSize, { Date: -1 });

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

    // Delete Department Data in one by one
    async UserDelete(UrlId, cb) {
        try {
            // Match Nad delete URl List
            const deleteJobProfiletData = await UserModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteJobProfiletData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "User deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "User not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }

    // Data GEt all List
    async getProfileData() {
        try {
            const UserProfile = await UserModule.find();
            return { status: 'success', data: UserProfile };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Update For Statues
    async Usertatus(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const statusUser = await UserModule.findOne({ U_URl_ID: UrlId });

            if (!statusUser) {
                return cb({ Status: "err", Message: "User not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusUser.isActive;
            await UserModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "User status updated successfully." });

        } catch (err) {
            console.error("Error updating User status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Find A Id card 
    async EmpIdCard(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const Emplyidcard = await UserModule.findOne({ U_URl_ID: UrlId });

            if (!Emplyidcard) {
                // User not found
                return cb({ Status: "err", Msg: "User not found", data: null });
            }


            // User found successfully
            return cb({ Status: "suc", Msg: "User data retrieved successfully", data: Emplyidcard });
        } catch (error) {

            console.error("Error retrieving user data:", error);
            return cb({ Status: "err", Msg: "Error retrieving user data", data: null });
        }
    }

    // Update User Data
    async UpdateUserData(userId, data, UserTRackUID, callback) {
        try {

            // Check if password and confirm password match
            if (data.Password !== data.ConfirmPassword) {
                return cb({ Status: 'err', Msg: 'Passwords do not match' });
            }

            // Convert JobProfile to its acronym & Cretad a EmploymentId
            const acronym = data.JobProfile
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase();

            // Generate a 4-digit random number
            const randomNumber = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
            const EmploymentId = `${config.EmploymentId}${acronym}${randomNumber}`;

            // Convert the data object to a JSON string and Cout the Lenght
            const dataString = JSON.stringify(data);
            const characterCount = dataString.length;

            // Hash the password
            const hashedPassword = await HashedGenerator.hashPassword(data, characterCount);

            //  Input Value Save 
            const updatedUser = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID.UID,
                Employment_ID: EmploymentId,
                Name: data.Name,
                Email: data.Email,
                Mobile_Number: data.PhoneNumber,
                Department: data.Department,
                Department_head: data.Department_head,
                Job_Profile_Post: data.Job_Profile_Post,
                Job_Profile: data.JobProfile,
                Acount: data.AcountType,
                Password: hashedPassword
            };

            // Update the user data in the database
            const result = await UserModule.findOneAndUpdate({ U_URl_ID: userId }, updatedUser, { new: true });

            if (result) {
                return callback({ Status: "Suc", Msg: "User updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "User not found or no changes detected." });
            }


        } catch (error) {
            console.error("Error updating user:", error);
            return callback({ Status: "fail", Msg: "Error updating user: " + error.message });
        }
    }

}

module.exports = SignUpAuthApi;