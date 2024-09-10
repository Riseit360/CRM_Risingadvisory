// Express Rout module import 
var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');

// File and Funtions import
const CollaboratorsController = require('../controllers/Collaborators/usercontroler')
var UserAgent = require("../middleware/useragent");
const BodyComponent = require('../middleware/bodycomponent');
const jobprofilecontroller = require("../controllers/hr/jobprofilecontroller")


// File canvert in object
const userdata = new CollaboratorsController();
const bodydata = new BodyComponent();
const Jobprofile = new jobprofilecontroller();


// Helper function to get Job Profile data
const getJobProfileData = async () => {
    const response = await Jobprofile.getJobProfileData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};




// User Pages 
router.get(["/", "/user", "/User"], async (req, res) => {
    try {
        await userdata.UserListData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view 
                return res.status(200).render("../views/Collaborators/user.ejs", {
                    title: "User",
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
        return res.status(200).redirect("/error_404");
    }
});

// Add User Pages 
router.get(["/add-user", "/add_user", "/Add-user", "/Add_user"], async (req, res) => {
    try {
        // Departments Data
        const JobProfile = await getJobProfileData();
        // Render form view
        return res.status(200).render("../views/Collaborators/add-user.ejs", {
            title: "Add User",
            JobProfile
        });

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add User', error);
        return res.status(200).redirect("/error_404");
    }
});

// Add User Post Rout
router.post(["/adduser"], async (req, res) => {
    try {
        // Data For Form
        const data = req.body;
        const UserTRackUID = req.requestData;

        // Data Save in Controller
        await userdata.AddUserData(data, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add User processed successfully.');
            } else {
                req.flash('Error while processing add User:', response.Msg);
            }
        })

        res.status(200).redirect("/Collaborators/user");

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Add Users', error);
        return res.status(200).redirect("/error_404");
    }
})

// Delete List Of user
router.get(["/user/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await userdata.UserDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/Collaborators/");

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

// User Update for active and Inctive
router.get(["/user/status/:U_URl_ID"], async (req, res) => {
    try {

        // Get Page ID
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await userdata.Usertatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                // Return to add pages 
                res.status(200).redirect('/Collaborators/');
            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        })

    } catch (error) {
        req.flash('Request Faild the Add Pages', error);
        return res.status(500).redirect("/error_404");
    }
})

// views Id Card 
router.get("/user/view/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        // Use the EmpIdCard method to get user data
        await userdata.EmpIdCard(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/Collaborators/employment-id-cerd.ejs", {
                    title: "Employment ID Cerd",
                    userData: cb.data
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });

    } catch (error) {
        req.flash('Request Failed to View User Data', error);
        return res.status(500).redirect("/error_404");
    }
});

// Update Edit Pages
router.get("/user/update/:U_URl_ID", async (req, res) => {
    try {

        // Get the U_URl_ID from the request parameters && Departments Data
        const UrlId = req.params.U_URl_ID;
        const JobProfile = await getJobProfileData();

        // Use the EmpIdCard method to get user data
        await userdata.EmpIdCard(UrlId, (cb) => {
            if (cb.Status === 'suc') {

                // Pass the user data to the view for rendering
                return res.status(200).render("../views/Collaborators/update-user.ejs", {
                    title: "Update User",
                    userData: cb.data,
                    JobProfile
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });

    } catch (error) {
        req.flash('Request Failed to View User Data', error);
        return res.status(500).redirect("/error_404");
    }
})

// Update USer
router.post("/UpdateUser/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData;

        // Data Save in Controller
        await userdata.UpdateUserData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('success', 'User updated successfully.');
            } else {
                req.flash('error', 'Error while updating user: ' + response.Msg);
            }
        });

        res.status(200).redirect("/Collaborators/user");

    } catch (error) {
        req.flash('Request Failed to View User Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});

// Export the Rout Functions
module.exports = router;