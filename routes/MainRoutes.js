// Express Rout module import 
var express = require('express');
var router = express.Router();


// File and Funtions import
const OgData = require('../ogtag/Og.json')
const { getogdata } = require('../middleware/OgData.js');
var UserVerification = require("../middleware/userverification.js");

// File canvert in object



// Home Pages 
router.get(["/dashboard", "/Dashboard", "/home", "/Home", "/welcome", "/Welcom"], UserVerification.checkcookie, async (req, res) => {
    try {

        // OgData
        var ogdata = getogdata(OgData, "Home");

        // Render form view
        return res.status(200).render("../views/main/index.ejs", {
            title: "Home",
            tagdata: ogdata
        });
    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For login', error);
        return res.status(500).redirect("/error_404");
    }
});


// Login Pages 
router.get(["/", "/login", "/sign-in", "/sign_in", "/Sign in", "/sign in"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        // Render form view
        return res.status(200).render("../views/accounts/login.ejs", {
            title: "Sign in"
        });

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For login', error);
        return res.status(500).redirect("/error_404");
    }
});



// Export the Rout Functions
module.exports = router;