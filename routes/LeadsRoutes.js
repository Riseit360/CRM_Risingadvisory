// Express Rout module import 
var express = require('express');
var router = express.Router();

// File and Funtions import
const CreadUserController = require("../controllers/user-leads/creduserController")
const Departmentcontroller = require("../controllers/hr/departmentcontroller")
const CollaboratorsController = require('../controllers/Collaborators/usercontroler')


// File canvert in object 
const LeadsData = new CreadUserController();
const Department = new Departmentcontroller();
const userdata = new CollaboratorsController()



// Helper function to Get Useer Leads Data
const GetUserLeadsData = async () => {
    const response = await LeadsData.ReferLeadsList();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};
// Helper function to get department data
const getDepartmentData = async () => {
    const response = await Department.getDepartmentData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};

// Helper function to get User Profile data
const getUserProfileData = async () => {
    const response = await userdata.getProfileData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};








// User Leads PAges 
router.get(["/user", "/new-user", "/User", "/new_user", "/New_User", "/New-User"], async (req, res) => {
    try {
        await LeadsData.LeadsListData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/leads/user.ejs", {
                    title: "Leads",
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
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
});

// Update Leads User
router.get(["/user/updateleads/:U_URl_ID"], async (req, res) => {
    try {

        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        await LeadsData.UpdateUserLeads(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/leads/leads-update.ejs", {
                    title: "Addon Details",
                    LeadsData: cb.data
                });

            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        })


    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
})

// addom Detail Update for leads
router.post("/user/UpdateAddonDetails/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await LeadsData.UpdateAddonDetails(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") {
                // Matching the exact case used in updatePagesData
                req.flash('success', 'Leads updated successfully.');
            } else {
                req.flash('error', 'Error while updating Pages: ' + response.Msg);
            }
        });

        res.status(200).redirect("/leads/user");

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
});

// Route for assigning leads
router.get(["/assign", "/Assign"], async (req, res) => {
    try {
        // Departments Data
        const LeadsData = await GetUserLeadsData();
        const departments = await getDepartmentData();
        const UserProfile = await getUserProfileData();

        // Render form view
        return res.status(200).render("../views/leads/assign.ejs", {
            title: "Assign Data",
            LeadsData,
            departments,
            UserProfile
        });

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
})

// Update assigning leads
router.post(["/assign/UpdateAssign"], async (req, res) => {
    try {
        // Data
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Assig Leadsin data based
        await LeadsData.AssignLead(data, UserTRackUID, (response) => {
            if (response && response.Status === "suc") {
                req.flash('success', 'Assign Leads updated successfully.');
            } else {
                req.flash('error', 'Error while updating Assign Leads: ' + (response ? response.Msg : 'Unknown error'));
            }
        });

        // Render
        res.status(200).redirect("/leads/assign");

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }

})

// User Leads PAges 
router.get(["/calling", "/Calling"], async (req, res) => {
    try {
        // Get User 
        const UserName = req.cookies.UserName || req.session.UserName;

        // Extract pagination parameters from query or default values
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;

        // Find Data For User name
        await LeadsData.CallingListData(UserName, page, pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/leads/calling.ejs", {
                    title: "Calling",
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
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
});

// Feedback
router.get(["/calling/feedback/:U_URl_ID"], async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        await LeadsData.UpdateUserLeads(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/leads/feedback.ejs", {
                    title: "Caling Feedback",
                    LeadsData: cb.data
                });

            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        })

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes Internal Server erro', error);
        return res.status(500).redirect("/error_404");
    }
});






// Export the Rout Functions
module.exports = router;