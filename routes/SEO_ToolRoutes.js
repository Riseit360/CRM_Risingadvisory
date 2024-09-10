// Express Rout module import 
var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path');
const fs = require('fs');

// File and Funtions import
const BodyComponent = require('../middleware/bodycomponent');
var UserAgent = require("../middleware/useragent");
const PagesApi = require('../controllers/pages/pagecontroller');
const Blogcontroler = require('../controllers/blogs/PostController');
const SeoToolController = require('../controllers/seo-tool/seocontroller');

// File canvert in object
const bodydata = new BodyComponent();
const SavePages = new PagesApi();
const SaveBlogs = new Blogcontroler();
const SaveMetaTag = new SeoToolController();


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



// Helper function to get User Profile data
const getpageData = async () => {
    const response = await SavePages.getPagesData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};

// Blogs Funtions Data
const getBlogsData = async () => {
    const response = await SaveBlogs.getPostData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};


// Menu Route
router.get(["/", "/meta"], async (req, res) => {
    try {
        // Get all data
        await SaveMetaTag.getAllMetaTag(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view 
                return res.status(200).render("../views/seo-tools/meta-tag.ejs", {
                    title: "Meta Tag",
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
        return res.status(200).redirect("/error_404");
    }
});

// Add Menu Route
router.get(["/create-meta-tag", "/Create-Meta-Tag", "/Create_Meta_Tag", "/add-meta-tag", "/Add-Meta-Tag"], async (req, res) => {
    try {
        // Pages Data
        const SavePageData = await getpageData();
        const SaveBloggsData = await getBlogsData();

        return res.status(200).render("../views/seo-tools/add-meta-tag.ejs", {
            title: "Create a Meta Tag",
            SavePageData,
            SaveBloggsData
        });

    } catch (error) {
        req.flash('Request navigation For Create a Menu ', error);
        return res.status(200).redirect("/error_404");
    }
});

// Save New Page 
router.post("/save-meta-tag", upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {
        // Data For req & user Agen Data & Uer Track
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controller
        await SaveMetaTag.saveMetatag(data, UserTRackUID, imagePath, (response) => {
            if (response.Status === "suc") {
                req.flash('User forget password processed successfully.');
            } else {
                req.flash('Error while processing forget password:', response.Msg);
            }
        });

        // Render list page Pages
        return res.status(200).redirect('/seo-tool/');

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
        console.log("🚀 ~ file: PagesRoutes.js:98 ~ router.get ~ UrlId:", UrlId)

        // Delete Page For Controller
        await SaveMetaTag.deletePage(UrlId, (response) => {
            if (response.Status === "suc") {
                req.flash('User forget password processed successfully.');
            } else {
                req.flash('Error while processing forget password:', response.Msg);
            }
        });

        // Return to add pages 
        return res.status(200).redirect('/seo-tool/');

    } catch (error) {
        req.flash('Request Faild the Add Pages', error);
        return res.status(500).redirect("/error_404");
    }

});

// Status Meta Tag
router.get(["/Status/:U_URl_ID"], async (req, res) => {
    try {

        // Get Page ID
        const UrlId = req.params.U_URl_ID;
        console.log("🚀 ~ file: PagesRoutes.js:98 ~ router.get ~ UrlId:", UrlId)

        // Databased List Delete
        await SaveMetaTag.MetaTagStatus(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                // Return to add pages 
                res.status(200).redirect('/seo-tool/');
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

// Download Json Meta Tag
router.get(["/download/"], async (req, res) => {
    try {
        // Fetch Meta Tag data from database
        const metaTagData = await SaveMetaTag.MetaTagDownload();

        // Check the status returned by MetaTagDownload method
        if (metaTagData.Status === 'suc') {

            // File Path to save as JSON
            const jsonData = JSON.stringify(metaTagData.data, null, 2);
            const filePath = path.join(__dirname, '../ogtag/Og.json');

            // Save JSON data to file in the project folder, overwriting existing file
            fs.writeFileSync(filePath, jsonData);

            // Send file as download to the user's machine
            res.download(filePath, 'Og.json', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                    req.flash("error", "Failed to download file.");
                    return res.status(500).redirect('/error_404');
                }

                // File was successfully downloaded
                console.log('File downloaded successfully');
            });

        } else {
            req.flash("error", metaTagData.Msg);
            res.status(400).redirect("/error_404");
        }

    } catch (error) {
        console.error('Failed to fetch Meta Tag data:', error);
        return res.status(500).redirect("/error_404");
    }
});

// Update Edit Pages
router.get("/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        // Pages Data
        const SavePageData = await getpageData();

        // Use the EmpIdCard method to get user data
        await SaveMetaTag.updateSeoMetaTag(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/seo-tools/MetaTag-update.ejs", {
                    title: "Update User",
                    MetaData: cb.data,
                    SavePageData
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

// UPdate Old Metag with new metatag
router.post("/UpdatePages/:U_URl_ID", upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {
        // Data For req & user Agen Data & Uer Track
        const UrlId = req.params.U_URl_ID;
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controller
        await SaveMetaTag.UpdateNewMetatag(UrlId, data, UserTRackUID, imagePath, (response) => {
            if (response.Status === "suc") { // Matching the exact case used in updatePagesData
                req.flash('success', 'Pages updated successfully.');
            } else {
                req.flash('error', 'Error while updating Pages: ' + response.Msg);
            }
        });

        // Render list page Pages
        return res.status(200).redirect('/seo-tool/');

    } catch (error) {
        req.flash('Request Failed to View User Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});




// Export the Rout Functions
module.exports = router;