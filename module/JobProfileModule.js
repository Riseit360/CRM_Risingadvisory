const mongoose = require('mongoose');

// Define the schema for job details
const JobDetailsSchema = new mongoose.Schema({
    job_title: {
        type: String,
        required: true
    },
    Job_Profile: {
        type: String,
        required: true
    },
    Department: {
        type: String,
        required: true
    },
    Department_Head: {
        type: String,
        required: true
    },
    Salary_Range: {
        type: String
    },
    Profile_Post: {
        type: String
    },
    Employment_Type: {
        type: String
    },
    Location: {
        type: String
    }
});

// Define the schema for job description, responsibilities, and requirements
const JobDescriptionSchema = new mongoose.Schema({
    Job_Description: {
        type: String
    },
    Responsibilities: {
        type: String
    },
    Requirements: {
        type: String
    }
});

// Define the main schema
const JobProfileSchema = new mongoose.Schema({
    U_URl_ID: {
        type: String,
        unique: true,
        required: true
    },
    UserAgentID: {
        type: String
    },
    jobDetails: JobDetailsSchema,
    jobDescription: JobDescriptionSchema,
    isActive: {
        type: Boolean,
        default: true
    },
    Date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Export the model
module.exports = mongoose.model('job_profile', JobProfileSchema);