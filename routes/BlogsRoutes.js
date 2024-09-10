// Express Rout module import 
var express = require('express');
var router = express.Router();
const multer = require('multer')
const path = require('path');

// File and Funtions import
const BodyComponent = require('../middleware/bodycomponent');
var UserAgent = require("../middleware/useragent");
var PostController = require('../controllers/blogs/PostController')


// File canvert in object
const bodydata = new BodyComponent();
const post = new PostController();

// Store 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/blogs/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });




// Blogs Pages Route
router.get(["/post", "/blogs"], async (req, res) => {
    try {
        await post.PostListData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                const blogPosts = cb.data;
                // Render form view 
                return res.status(200).render("../views/blogs/post.ejs", {
                    title: "Post",
                    Data: cb.data,
                    currentPage: cb.currentPage,
                    totalPages: cb.totalPages,
                    pageSize: cb.pageSize
                });

            } else {
                req.flash("error", cb.Msg);
                return res.status(500).redirect("/error_404.js");
            }
        })
    } catch (error) {
        req.flash('Request Access Control For Pages', error);
        return res.status(200).redirect("/error_404");
    }
});

// Add Post Pages Route
router.get(["/add-post", "/add_post", "/Add_Post", "/Add-Post", "/add-blogs", "/add_blogs", "/Add-Blogs"], async (req, res) => {
    try {
        return res.status(200).render("../views/blogs/add-post.ejs", {
            title: "Add Post"
        });

    } catch (error) {
        req.flash('Request Access Control For Pages', error);
        return res.status(200).redirect("/error_404");
    }
});

// Created post pages Routes
router.post(["/CreatedPost"], upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {

        // Data For req & user Agen Data & Uer Track
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in controller
        await post.postDataSave(data, UserTRackUID, imagePath, (response) => {
            if (response.Status === "suc") {
                req.flash('success', 'Add Post processed successfully.');
            } else {
                req.flash('error', `Error while processing Add Post: ${response.Msg}`);
            }
        });

        // Render list page Pages
        return res.status(200).redirect('/blogs/post');

    } catch (error) {
        req.flash('error', `Request Access Control For Pages: ${error.message}`);
        return res.status(200).redirect("/error_404");
    }
});

// Status Post by ID
router.get("/post/Status/:U_URl_ID", async (req, res) => {
    try {
        // Get Page ID
        const UrlId = req.params.U_URl_ID;
        const UserTRackUID = req.requestData.UID;
        console.log("🚀 ~ file: BlogsRoutes.js:104 ~ router.get ~ UserTRackUID:", UserTRackUID)

        // Delete Page For Controller
        await post.PostStatus(UrlId, UserTRackUID, (response) => {
            if (response.Status === "suc") {
                req.flash('Status Pages Update processed successfully.');
            } else {
                req.flash('Error while processing Status Pages Update:', response.Msg);
            }
        });

        // Return to add pages 
        return res.status(200).redirect('/blogs/post');

    } catch (error) {
        req.flash('Request Faild the Status Pages Update', error);
        return res.status(500).redirect("/error_404");
    }

});

// Delete Post By ID
router.get("/post/delete/:U_URl_ID", async (req, res) => {
    try {
        // Get Page ID
        const UrlId = req.params.U_URl_ID;

        await post.DeletePost(UrlId, (response) => {
            if (response.Status === "suc") {
                req.flash('Delete Pages processed successfully.', response.Msg);
            } else {
                req.flash('Error while processing Delete Pages:', response.Msg);
            }
        })

        // Return to Post pages 
        return res.status(200).redirect('/blogs/post')

    } catch (error) {
        req.flash('Request Faild the Status Pages Update', error);
        return res.status(500).redirect("/error_404");
    }

})

// Update Edit Pages
router.get("/post/update/:U_URl_ID", async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;

        // Use the EmpIdCard method to get user data
        await post.updateposts(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                // Pass the user data to the view for rendering
                return res.status(200).render("../views/blogs/update-blogs.ejs", {
                    title: "Update Post",
                    PostData: cb.data
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(400).redirect("/error_404");
            }
        });

    } catch (error) {
        req.flash('Request Failed to View Post Data', error);
        return res.status(500).redirect("/error_404");
    }
})

router.post("/post/UpdatePost/:U_URl_ID", upload.single('FeaturedImage'), bodydata.requireAuth, async (req, res) => {
    try {
        // Get the U_URl_ID from the request parameters
        const UrlId = req.params.U_URl_ID;
        const data = req.bodyData;
        const imagePath = req.file.filename;
        const UserTRackUID = req.requestData.UID;

        // Data Save in Controller
        await post.PostUpdateData(UrlId, data, imagePath, UserTRackUID, (response) => {
            if (response.Status === "suc") { // Matching the exact case used in updatePagesData
                req.flash('success', 'Post updated successfully.');
            } else {
                req.flash('error', 'Error while updating Post: ' + response.Msg);
            }
        });

        // Return To Post PAges
        return res.status(200).redirect("/blogs/post");
    } catch (error) {
        req.flash('Request Failed to View Post Data', error.message);
        return res.status(500).redirect("/error_404");
    }
});




// Export the Rout Functions
module.exports = router;