// Express Rout module import 
var express = require('express');
var router = express.Router();

// File and Funtions import
const BodyComponent = require('../middleware/bodycomponent');
var UserAgent = require("../middleware/useragent");
const Departmentcontroller = require("../controllers/hr/departmentcontroller")
const CollaboratorsController = require('../controllers/Collaborators/usercontroler')
const navigation = require('../controllers/navigation/NavigationController');
const RolesController = require('../controllers/access-control/RolesController')
const PermissionsController = require('../controllers/access-control/PermissionsControllers')

// File canvert in object
const bodydata = new BodyComponent();
const Department = new Departmentcontroller();
const userdata = new CollaboratorsController()
const MenuSave = new navigation();
const Roles = new RolesController();
const Permissions = new PermissionsController();


// Helper function to get User Profile data
const getUserProfileData = async () => {
    const response = await userdata.getProfileData();
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

// Helper function to get department data
const getNavData = async () => {
    const response = await MenuSave.navigationData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};

// Helper function to get department data
const getRolesData = async () => {
    const response = await Roles.getRolesListData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};



// Assign roles Rout
router.get(["/", "/assign-roles", "/assign_roles", "/Assign-Roles", "/Assign_Roles"], async (req, res) => {
    try {

        await Roles.RolesListData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/access-control/assign-roles.ejs", {
                    title: "Assign Roles",
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
        req.flash('Request Access Control For Assign roles', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Assign roles  Rout
router.get(["/add-assign-roles", "/add_assign_roles", "/Add-Assign-Roles", "/Add_Assign_Roles"], async (req, res) => {
    try {

        // Departments Data
        const UserProfile = await getUserProfileData();
        const departments = await getDepartmentData();
        const navigation = await getNavData();

        return res.status(200).render("../views/access-control/add-assign-roles.ejs", {
            title: "Add Roles",
            UserProfile,
            departments,
            navigation
        })

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request Access Control For Add Assign roles', error);
        return res.status(500).redirect("/error_404");
    }
});

// Frenulum Tear
router.post(["/CreateRoles"], bodydata.requireAuth, async (req, res) => {
    try {
        const bodydata = req.bodyData;
        console.log("🚀 ~ file: AccessControlRoutes.js:119 ~ router.post ~ bodydata:", bodydata)
        const UserTRackUID = req.requestData.UID;

        await Roles.addRoles(bodydata, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add Roles successfully.');
            } else {
                req.flash('Error while Roles:', response.Msg);
            }
        })

        return res.status(200).redirect('/access-control/assign-roles')

    } catch (error) {
        req.flash("Error Status to Department Update:", error);
        res.status(500).redirect("/error_404");
    }
})

// Roles Update Statues
router.get(["/assign-roles/Status/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Department Status
        await Roles.RolesStatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/access-control/assign-roles");

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

// Roles Delete Statues
router.get(["/assign-roles/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Delete Roles Statues
        await Roles.RolesDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/access-control/assign-roles");

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
router.get("/assign-roles/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters 
        const UrlId = req.params.U_URl_ID;
        const UserProfile = await getUserProfileData();
        const departments = await getDepartmentData();
        const navigation = await getNavData();

        // Use the Department method  
        await Roles.updateRoles(UrlId, (cb) => {
            if (cb.Status === 'suc') {

                // update Pages 
                return res.status(200).render("../views/access-control/update-assign-roles.ejs", {
                    title: "Update Roles",
                    RolesData: cb.data,
                    UserProfile,
                    departments,
                    navigation
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
router.post("/assign-roles/UpdateRoles/:U_URl_ID", bodydata.requireAuth, async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await Roles.UpdateRolesData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") {
                req.flash('success', 'Roles updated successfully.');
            } else {
                req.flash('error', 'Error while updating Roles: ' + response.Msg);
            }
        });

        // Render List Pages
        res.status(200).redirect("/access-control/assign-roles/");

    } catch (error) {
        req.flash('Request Failed to View Roles Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});


// Permission Rout
router.get(["/permissions", "/Permissions"], async (req, res) => {
    try {
        await Permissions.PermissionsListData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/access-control/permission.ejs", {
                    title: "Permissi`ons",
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
        req.flash('Request Access Control For Permissions', error);
        return res.status(500).redirect("/error_404");
    }
});

// Permission Rout
router.get(["/add-permissions", "/add-Permissions", "/add_permissions", "/add_Permissions"], async (req, res) => {
    try {
        // Departments Data
        const UserProfile = await getUserProfileData();
        const departments = await getDepartmentData();
        const navigation = await getNavData();
        const RolesData = await getRolesData();

        // Render form view
        return res.status(200).render("../views/access-control/add-permission.ejs", {
            title: "Add Permissions",
            UserProfile,
            departments,
            navigation,
            RolesData
        });
    } catch (error) {
        // Redirect to another error page 
        req.flash('Request Access Control For Permissions', error);
        return res.status(500).redirect("/error_404");
    }
});

// Create Permissions
router.post(["/Createpermissions"], bodydata.requireAuth, async (req, res) => {
    try {
        const bodydata = req.bodyData;
        const UserTRackUID = req.requestData.UID;

        await Permissions.addPermissions(bodydata, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add Permissions successfully.');
            } else {
                req.flash('Error while Permissions:', response.Msg);
            }
        })
        // Render List Pages
        return res.status(200).redirect('/access-control/permissions')

    } catch (error) {
        req.flash("Error Status to Department Update:", error);
        res.status(500).redirect("/error_404");
    }
})

// Roles Update Statues
router.get(["/permissions/Status/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Department Status
        await Permissions.PermissionsStatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/access-control/permissions");

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

// Roles Delete Statues
router.get(["/permissions/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Delete Roles Statues
        await Permissions.PermissionsDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/access-control/permissions");
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
router.get("/permissions/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters 
        const UrlId = req.params.U_URl_ID;
        const UserProfile = await getUserProfileData();
        const departments = await getDepartmentData();
        const navigation = await getNavData();
        const RolesData = await getRolesData();

        // Use the Department method  
        await Permissions.updatePermissions(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // update Pages 
                return res.status(200).render("../views/access-control/update-permission.ejs", {
                    title: "Update Roles",
                    PermissionsData: cb.data,
                    UserProfile,
                    departments,
                    navigation,
                    RolesData
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
router.post("/UpdateRoles/:U_URl_ID", bodydata.requireAuth, async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await Permissions.UpdatePermissionsData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") {
                // check for 'suc'
                req.flash('success', 'Roles updated successfully.');
            } else {
                req.flash('error', 'Error while updating Roles: ' + response.Msg);
            }
        });
        // Render List Pages
        res.status(200).redirect("/access-control/permissions");
    } catch (error) {
        req.flash('Request Failed to View Roles Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});


// Export the Rout Functions
module.exports = router;