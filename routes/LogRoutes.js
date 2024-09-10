// Express Rout module import 
var express = require('express');
var router = express.Router();

// File and Funtions import
var UserAgent = require("../middleware/useragent");
const BodyComponent = require('../middleware/bodycomponent');
const Logcontroller = require("../controllers/mid/useragentcontroller")

// File canvert in object 
const LogsData = new Logcontroller();




// Department Pages 
router.get(["/crm", "/log-crm", "/log_crm", "/Log-CRM", "/Log_CRM"], async (req, res) => {
    try {
        await LogsData.CRMLogData(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/logs/crm-log.ejs", {
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
        req.flash('Request AuthenticatedsRoutes For CRM Log', error);
        return res.status(500).redirect("/error_404");
    }
});


// Department Pages 
router.get(["/site", "/log-site", "/log_site", "/Log-site", "/Log_SITE"], async (req, res) => {
    try {
        await LogsData.LogSiteList(req.page, req.pageSize, (cb) => {

            console.log("🚀 ~ file: LogRoutes.js:55 ~ returnres.status ~ cb.data:", cb.data)
            if (cb.Status === "suc") {
                // Render form view
                return res.status(200).render("../views/logs/site-log.ejs", {
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
        req.flash('Request AuthenticatedsRoutes For Site Log', error);
        return res.status(500).redirect("/error_404");
    }
});


// Export the Rout Functions
module.exports = router;