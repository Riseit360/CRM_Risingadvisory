// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');

// File Controller for storing 
var JobProfileModule = require('../../module/JobProfileModule');
var paginateData = require('../../helper/pagination');

class JobProfileApi {

    // save Department post Data Save
    async savejobprofileData(data, UserTRackUID, cb) {
        try {
            //  Input Value Save 
            const jobprofile = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                jobDetails: {
                    job_title: data.job_title,
                    Job_Profile: data.job_profile,
                    Department: data.department,
                    Department_Head: data.department_head,
                    Salary_Range: data.salary_range,
                    Profile_Post: data.profile_post,
                    Employment_Type: data.employment_type,
                    Location: data.location
                },
                jobDescription: {
                    Job_Description: data.job_description,
                    Responsibilities: data.responsibilities,
                    Requirements: data.requirements
                }
            };

            // Save to Database
            const jobProfilesave = new JobProfileModule(jobprofile);
            await jobProfilesave.save();

            return cb({ Status: "suc", Msg: "Job Profile saved successfully" });

        } catch (error) {
            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving URL" });
        }


    }
    // All List of Department Data
    async jobprofilData(page, pageSize, cb) {
        try {
            const DataList = await paginateData(JobProfileModule, page, pageSize, { Date: -1 });

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
    // Data GEt all List
    async getJobProfileData() {
        try {
            const JobProfile = await JobProfileModule.find();
            return { status: 'success', data: JobProfile };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }
    // Delete Department Data in one by one
    async JobProfileDelete(UrlId, cb) {
        try {
            // Match Nad delete URl List
            const deleteJobProfiletData = await JobProfileModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteJobProfiletData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Job Profile deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Job Profile not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }
    // Update Status
    async JobprofileStatus(UrlId, cb) {
        try {
            // Find the MetaTag by U_URl_ID
            const statusJobprofile = await JobProfileModule.findOne({ U_URl_ID: UrlId });

            if (!statusJobprofile) {
                return cb({ Status: "err", Message: "MetaTag not found." });
            }

            // Toggle the isActive status
            const newStatus = !statusJobprofile.isActive;
            await JobProfileModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "MetaTag status updated successfully." });

        } catch (err) {
            console.error("Error updating MetaTag status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Find A DepartMent
    async updateJobprofile(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const JobProFileData = await JobProfileModule.findOne({ U_URl_ID: UrlId });

            if (!JobProFileData) {
                // User not found
                return cb({ Status: "err", Msg: "Job Profile not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "Job Profile data retrieved successfully", data: JobProFileData });
        } catch (error) {

            console.error("Error retrieving user data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Job Profile data", data: null });
        }
    }

    // Update DepartMent Data
    async updateJobPrfileData(UrlId, data, UserTRackUID, callback) {
        try {
            // Input Value Save
            const updateJobProfile = {
                UserAgentID: UserTRackUID.UID,
                jobDetails: {
                    job_title: data.job_title,
                    Job_Profile: data.job_profile,
                    Department: data.department,
                    Department_Head: data.department_head,
                    Salary_Range: data.salary_range,
                    Profile_Post: data.profile_post,
                    Employment_Type: data.employment_type,
                    Location: data.location
                },
                jobDescription: {
                    Job_Description: data.job_description,
                    Responsibilities: data.responsibilities,
                    Requirements: data.requirements
                }
            };

            // Update the Job Profile in the database
            const result = await JobProfileModule.findOneAndUpdate({ U_URl_ID: UrlId }, updateJobProfile, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Job Profile updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "Job Profile not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating Job Profile:", error);
            return callback({ Status: "fail", Msg: "Error updating Job Profile: " + error.message });
        }
    }


}

module.exports = JobProfileApi;