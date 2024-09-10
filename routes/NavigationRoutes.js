// Express Rout module import 
var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path');

// File and Funtions import
const BodyComponent = require('../middleware/bodycomponent');
var UserAgent = require("../middleware/useragent");
const PagesApi = require('../controllers/pages/pagecontroller');
const navigation = require('../controllers/navigation/NavigationController');


// File canvert in object
const bodydata = new BodyComponent();
const SavePages = new PagesApi();
const MenuSave = new navigation();


// Helper function to get User Profile data
const getpageData = async () => {
    const response = await SavePages.getPagesData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};



// Menu Route
router.get(["/", "/menu"], async (req, res) => {
    try {

        // Get all data
        await MenuSave.AllNavList(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view 
                return res.status(200).render("../views/navigation/menu.ejs", {
                    title: "Menu",
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
        req.flash('Request navigation For Menu ', error);
        return res.status(500).redirect("/error_404");
    }
});

// Add Menu Route
router.get(["/create-menu", "create_menu", "/Create-Menu", "/Create_Menu", "/add-menu", "/Add-Menu"], async (req, res) => {
    try {
        // Pages Data
        const SavePageData = await getpageData();
        return res.status(200).render("../views/navigation/add-menu.ejs", {
            title: "Create a Menu",
            SavePageData
        });

    } catch (error) {
        req.flash('Request navigation For Create a Menu ', error);
        return res.status(500).redirect("/error_404");
    }
});

// Menu  Save
router.post(["/SaveMenu"], async (req, res) => {
    try {
        // Data For req & user Agen Data & Uer Track
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        //  Save Menu Data in Controller to databased
        await MenuSave.AddMenuData(data, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('Add Menu successfully Save.');
            } else {
                req.flash('Error while Add Menu:', response.Msg);
            }
        })

        // Render Navigation
        return res.status(200).redirect('/navigation/');

    } catch (error) {
        req.flash('Request navigation For Create a Menu ', error);
        return res.status(500).redirect("/error_404");
    }

});

// Delete List Of Url
router.get(["/menu/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await MenuSave.navigationDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/navigation/menu");
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

// Status List Of Url
router.get(["/menu/Status/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Department Status
        await MenuSave.Navigationtatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/navigation/menu");

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

// Update Edit Navigation
router.get("/menu/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters && Departments Data
        const UrlId = req.params.U_URl_ID;
        const SavePageData = await getpageData();

        // Use the Department method  
        await MenuSave.updatenavigatione(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/navigation/menu-update.ejs", {
                    title: "Menu Update",
                    navigation: cb.data,
                    SavePageData
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash('Request Failed to View Navigation Data', error);
        return res.status(500).redirect("/error_404");
    }
})

// Update USer
router.post("/menu/UpdateMenu/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.body;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await MenuSave.updateNavData(UrlId, data, UserTRackUID, (response) => {
            if (response.Status === "suc") {
                // Matching the exact case used in updatePagesData
                req.flash('success', 'Navigation updated successfully.');
            } else {
                req.flash('error', 'Error while updating Navigation: ' + response.Msg);
            }
        });

        res.status(200).redirect("/navigation/menu");

    } catch (error) {
        req.flash('Request Failed to View Navigation Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});


// Export the Rout Functions
module.exports = router;