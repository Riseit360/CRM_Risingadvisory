// Express Rout module import 
var express = require('express');
var router = express.Router();


// File and Funtions import
var SendEmail = require("../controllers/developer-settings/emailsendcontroller.js");
const BodyComponent = require("../middleware/bodycomponent.js");

// File New Object
var sendemail = new SendEmail();
const bodydata = new BodyComponent();


// Form Data Api Get 
router.get(["/form", "/user-form", "/User-Form", "/user_form"], async (req, res) => {
    try {
        // Render form view
        return res.status(200).render("../views/developer-settings/form.ejs", {
            title: "Home"
        });

    } catch (error) {
        req.flash('Request APIRoutes For Form', error);
        return res.status(500).redirect("/error_404");
    }
});


// Form Data Api Post 
router.post(["/user-form"], bodydata.requireAuth, async (req, res) => {
    try {
        // Get All Data in req Body
        const formData = req.bodyData;

        // Mail Send & Render form view
        await sendemail.sendemailfromcontactus(formData, (cb) => { console.log(cb) });
        return res.status(200).redirect("/");

    } catch (error) {
        // Redirect to another error page
        req.flash('Request APIRoutes For Post Api Form', error);
        return res.status(500).redirect("/error_404");
    }
});


// Export the Rout Functions
module.exports = router;