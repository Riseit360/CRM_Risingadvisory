// Express Rout module import 
var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path');

// File and Funtions import
const BodyComponent = require('../middleware/bodycomponent');
var UserAgent = require("../middleware/useragent");
const PagesApi = require('../controllers/pages/pagecontroller');


// File canvert in object
const bodydata = new BodyComponent();
const SavePages = new PagesApi();


// Store 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// Pages Route
router.get(["/", "/page"], async (req, res) => {
    try {
        // Get all data
        SavePages.getAllPages(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view 
                return res.status(200).render("../views/pages/pages.ejs", {
                    title: "Pages",
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
        req.flash('Request Access Control For Pages', error);
        return res.status(200).redirect("/error_404");
    }
});

// Add Pages Route
router.get(["/add-page", "/add_page", "/Add-Page", "/Add_Page"], async (req, res) => {
    try {
        return res.status(200).render("../views/pages/add-pages.ejs", {
            title: "Add Pages"
        });
    } catch (error) {
        req.flash('Request Faild To the Add Pages Urls', error);
        return res.status(500).redirect("/error_404");
    }
});

// Save New Page 
router.post("/addpagedata", upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {
        // Data For req & user Agen Data & Uer Track
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controller
        await SavePages.addPage(data, UserTRackUID, imagePath, (response) => {
            if (response.Status === "suc") {
                req.flash('Add Pages processed successfully.');
            } else {
                req.flash('Error while processing Add Pages:', response.Msg);
            }
        });

        // Render list page Pages
        return res.status(200).redirect('/page/');

    } catch (error) {
        req.flash('Request Faild the Add Pages', error);
        return res.status(500).redirect("/error_404");
    }
});

// Delete Page by ID
router.get("/delete/:U_URl_ID", async (req, res) => {
    try {
        // Get Page ID
        const UrlId = req.params.U_URl_ID;

        // Delete Page For Controller
        await SavePages.deletePage(UrlId, (response) => {
            if (response.Status === "suc") {
                req.flash('Delete Pages processed successfully.', response.Msg);
            } else {
                req.flash('Error while processing Delete Pages:', response.Msg);
            }
        });

        // Return to add pages 
        return res.status(200).redirect('/page/page/');

    } catch (error) {
        req.flash('Request Faild the Delete Pages', error);
        return res.status(500).redirect("/error_404");
    }

});

// Status Page by ID
router.get("/Status/:U_URl_ID", async (req, res) => {
    try {
        // Get Page ID
        const UrlId = req.params.U_URl_ID;
        console.log("🚀 ~ file: PagesRoutes.js:98 ~ router.get ~ UrlId:", UrlId)

        // Delete Page For Controller
        await SavePages.Pagestatus(UrlId, (response) => {
            if (response.Status === "suc") {
                req.flash('Status Pages Update processed successfully.');
            } else {
                req.flash('Error while processing Status Pages Update:', response.Msg);
            }
        });

        // Return to add pages 
        return res.status(200).redirect('/page/page/');

    } catch (error) {
        req.flash('Request Faild the Status Pages Update', error);
        return res.status(500).redirect("/error_404");
    }

});

// Update Edit Pages
router.get("/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        // Use the EmpIdCard method to get user data
        await SavePages.updatePages(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/pages/pages-update.ejs", {
                    title: "Update User",
                    PagesData: cb.data
                });

            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });

    } catch (error) {
        req.flash('Request Failed to View Pages Data', error);
        return res.status(500).redirect("/error_404");
    }
})

router.post("/UpdatePages/:U_URl_ID", upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await SavePages.updatePagesData(UrlId, data, imagePath, UserTRackUID, (response) => {
            if (response.Status === "suc") { // Matching the exact case used in updatePagesData
                req.flash('success', 'Pages updated successfully.');
            } else {
                req.flash('error', 'Error while updating Pages: ' + response.Msg);
            }
        });

        res.status(200).redirect("/page");

    } catch (error) {
        req.flash('Request Failed to View User Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});




// Export the Rout Functions
module.exports = router;