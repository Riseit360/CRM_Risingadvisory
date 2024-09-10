// Express Rout module import 
var express = require('express');
var router = express.Router();

// File and Funtions import
var UserAgent = require("../middleware/useragent");
const BodyComponent = require('../middleware/bodycomponent');
const Departmentcontroller = require("../controllers/hr/departmentcontroller")
const jobprofilecontroller = require("../controllers/hr/jobprofilecontroller")

// File canvert in object
const bodydata = new BodyComponent();
const Department = new Departmentcontroller();
const Jobprofile = new jobprofilecontroller();


// Helper function to get department data
const getDepartmentData = async () => {
    const response = await Department.getDepartmentData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};


// Department Pages 
router.get(["/", "/Department", "/department"], async (req, res) => {
    try {
        await Department.DepartmentData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/hr/department.ejs", {
                    title: "Add Department",
                    Data: cb.data,
                    currentPage: cb.currentPage,
                    totalPages: cb.totalPages,
                    pageSize: cb.pageSize
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(500).redirect("/error_404.js");
            }
        });
    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Department', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Department Pages 
router.get(["/add-department", "/add_department", "/adddepartment", "/AddDepartment"], async (req, res) => {
    try {
        // Render form view
        return res.status(200).render("../views/hr/add-department.ejs", {
            title: "Add Department"
        });

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add Department', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Department Data
router.post(["/adddepartment"], async (req, res) => {
    try {
        // Data 
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controlelr
        await Department.saveDepartmentData(data, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add Department successfully.');
            } else {
                req.flash('Error while Department:', response.Msg);
            }
        });

        // Render Login Pages
        return res.status(200).redirect('/hr/');

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add Department', error);
        return res.status(500).redirect("/error_404");
    }
})

// Delete List Of Url
router.get(["/department/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await Department.DepartmentDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/hr/department");

            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        })
    } catch (error) {
        req.flash("Error Delete to Department:", error);
        res.status(500).redirect("/error_404");
    }
});

// Delete List Of Url
router.get(["/department/Status/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Department Status
        await Department.DepartmentStatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/hr/department");

            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        })
    } catch (error) {
        req.flash("Error Status to Department Update:", error);
        res.status(500).redirect("/error_404");
    }
});

// Update Edit Pages
router.get("/department/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters && Departments Data
        const UrlId = req.params.U_URl_ID;

        // Use the Department method  
        await Department.updateDepartment(UrlId, (cb) => {
            if (cb.Status === 'suc') {

                // Pass the user data to the view for rendering
                return res.status(200).render("../views/hr/update-department.ejs", {
                    title: "Update Department",
                    userData: cb.data
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash('Request Failed to View Department Data', error);
        return res.status(500).redirect("/error_404");
    }
})

// Update USer
router.post("/department/Updatedepartment/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData;

        // Data Save in Controller
        await Department.UpdateDepaData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") { // Matching the exact case used in updatePagesData
                req.flash('success', 'Department updated successfully.');
            } else {
                req.flash('error', 'Error while updating Department: ' + response.Msg);
            }
        });

        res.status(200).redirect("/hr/department/");

    } catch (error) {
        req.flash('Request Failed to View Department Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});


// Add Job Profile Pages 
router.get(["/Job-profile", "/Job_profile", "/Jobprofile"], async (req, res) => {
    try {
        await Jobprofile.jobprofilData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view 
                return res.status(200).render("../views/hr/Job-profile.ejs", {
                    title: "Job Profile",
                    Data: cb.data,
                    currentPage: cb.currentPage,
                    totalPages: cb.totalPages,
                    pageSize: cb.pageSize
                });

            } else {
                req.flash("error", cb.Msg);
                return res.status(500).redirect("/error_404.js");
            }
        });
    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Job Profile', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Job Profile Pages 
router.get(["/add-Job-profile", "/add_Job_profile", "/addJobprofile"], async (req, res) => {
    try {
        // Departments Data
        const departments = await getDepartmentData();

        // Render form view
        return res.status(200).render("../views/hr/add-Job-profile.ejs", {
            title: "Add Job Profile",
            departments
        });

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add Job Profile', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Job  Profile Data
router.post(["/addjobprofile"], async (req, res) => {
    try {
        // Data 
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controlelr
        await Jobprofile.savejobprofileData(data, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add Job Profile  successfully.');
            } else {
                req.flash('Error while Job Profile:', response.Msg);
            }
        });

        // Render Login Pages
        return res.status(200).redirect('/hr/Job-profile');

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add Job Profile', error);
        return res.status(500).redirect("/error_404");
    }
})

// Delete List Of Url
router.get(["/Job-profile/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await Jobprofile.JobProfileDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/hr/Job-profile");

            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        })
    } catch (error) {
        req.flash("Error Delete to URL:", error);
        res.status(500).redirect("/error_404");
    }
});

// Delete List Of Url
router.get(["/Job-profile/Status/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Department Status
        await Jobprofile.JobprofileStatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/hr/Job-profile");

            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        })
    } catch (error) {
        req.flash("Error Delete to URL:", error);
        res.status(500).redirect("/error_404");
    }
});

// Update Edit Pages
router.get("/Job-profile/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters && Departments Data
        const UrlId = req.params.U_URl_ID;
        const departments = await getDepartmentData();

        // Use the Department method  
        await Jobprofile.updateJobprofile(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/hr/update-Jobprofile.ejs", {
                    title: "Update Job Profile",
                    JobProfile: cb.data,
                    departments
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash('Request Failed to View Job Profile Data', error);
        return res.status(500).redirect("/error_404");
    }
})

// Update USer
router.post("/Job-profile/Updatedepartment/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData;

        // Data Save in Controller
        await Jobprofile.updateJobPrfileData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") { // Matching the exact case used in updatePagesData
                req.flash('success', 'Job Profile updated successfully.');
            } else {
                req.flash('error', 'Error while updating Job Profile: ' + response.Msg);
            }
        });
        res.status(200).redirect("/hr/Job-profile/");
    } catch (error) {
        req.flash('Request Failed to View Job Profile Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});




// Export the Rout Functions
module.exports = router;