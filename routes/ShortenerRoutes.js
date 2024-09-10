// Express Rout module import 
var express = require('express');
var router = express.Router();
const { nanoid } = require('nanoid')
const multer = require('multer');
const readline = require('readline');
const xlsx = require('xlsx');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const path = require('path');
const moment = require('moment');

// File Controller for storing 
var Config = require("../config/config.json");
var UrlController = require("../controllers/url-shortener/urlcontroller")
var UrlVisiter = require('../controllers/url-shortener/urlvisitercontroller')
const paginationMiddleware = require('../middleware/paginationMiddleware'); // Adjust path as needed


// Class To object
var Urlsave = new UrlController();
var urlvisiter = new UrlVisiter();

// Multer For File Update
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Paginations
router.use(paginationMiddleware);



// Rout For URl Shortener Pages
router.get(["/", "/url-shortener"], async (req, res) => {
    try {
        return res.status(200).render("../views/shortener/index.ejs", {
            title: "URL Shortener"
        });
    } catch (error) {
        req.flash("Error For the URL Not Working:", error);
        res.status(500).redirect("/error_404");
    }
});

// Rout For The Single Url Shortener
router.post('/shorten', async (req, res) => {

    try {
        // Get Input Url Data
        const longURL = req.body.longURL;

        // Cretad a 6 Digit Url Data ForShortinbg
        const shortID = nanoid(6);
        //const shortURL = `${Config.BASE_URL}/${shortID}`;
        const shortURL = `${shortID}`;

        // Set a conntroller Data
        await Urlsave.URl_Shortener(longURL, shortURL, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/shortener/url-list");

            } else {
                req.flash("error", cb.Msg);
                res.status(400).redirect("/error_404");
            }
        });

    } catch (error) {
        req.flash("Error For the Post URL:", error);
        res.status(500).redirect("/error_404");
    }
})

// Rout For Bulk Url Shortener 
router.post('/bulkurlshortener', async (req, res) => {
    try {
        // Text Area Bulkn Url
        const bulkURLs = req.body.BulkURL.split('\n').map(url => url.trim());

        // Bulk Url Canvert in Short Url
        const shortURLs = bulkURLs.map(url => {
            const shortID = nanoid(6);
            // const shortURL = `${Config.BASE_URL}/${shortID}`;
            const shortURL = `${shortID}`;
            return { originalURL: url, shortURL };
        });

        // Loop And Data save Controller
        const promises = shortURLs.map(({ originalURL, shortURL }) => {
            return new Promise((resolve, reject) => {

                // Save Data In database
                Urlsave.URl_BulkShortener(originalURL, shortURL, (cb) => {
                    if (cb.Status === 'suc') {
                        req.flash("success", cb.Msg);
                        resolve();
                    } else {
                        req.flash("error", cb.Msg);
                        reject(cb.Msg);
                    }
                });

            });
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        // If all promises are resolved successfully
        req.flash("success", "Bulk URLs shortened successfully");
        res.status(200).redirect("/shortener/url-list");

    } catch (error) {
        req.flash("Error processing bulk URL shortening:", error);
        res.status(500).redirect("/error_404");
    }

});

// Dispaly Url Shorterner 
router.get(["/url-list"], async (req, res) => {
    try {
        await Urlsave.URl_Shortener_data(req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                return res.status(200).render("../views/shortener/url-shortener.ejs", {
                    title: "URL List",
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
        req.flash("Error fetching URL data:", error);
        res.status(500).redirect("/error_404.js");
    }
});

// Delete List Of Url
router.get(["/url-list/delete/:U_URl_ID"], async (req, res) => {
    try {
        // Get Id Number For URL List
        const UrlId = req.params.U_URl_ID;

        // Databased List Delete
        await Urlsave.URlShortDelete(UrlId, (cb) => {
            if (cb.Status === 'suc') {
                req.flash("success", cb.Msg);
                res.status(200).redirect("/shortener/url-list");

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

// import Url File in wxcel
router.post(["/upload"], upload.single('fileName'), async (req, res) => {
    try {
        // Read the uploaded Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

        // Extract URLs from the data (assuming URLs are in the first column)
        const urls = data.map(row => row[0]).filter(url => typeof url === 'string' && url.trim());

        const promises = [];

        // Loop For Data List Pick
        for (const longURL of urls) {
            const trimmedURL = longURL.trim();
            const shortID = nanoid(6);
            // const shortURL = `${Config.BASE_URL}/${shortID}`;
            const shortURL = `${shortID}`;
            // Save in Databased 
            const promise = new Promise((resolve, reject) => {
                Urlsave.URl_Shortener(trimmedURL, shortURL, (cb) => {
                    if (cb.Status === 'suc') {
                        resolve();
                    } else {
                        reject(new Error(cb.Msg));
                    }
                });
            });
            promises.push(promise);
        }

        await Promise.all(promises);

        req.flash("success", "File processed and URLs shortened successfully");
        res.status(200).redirect("/shortener/url-list");

    } catch (error) {
        req.flash("Error processing file and shortening URLs:", error);
        res.status(500).redirect("/error_404");
    }

});

// Download full File 
router.get(["/url-list/download"], async (req, res) => {
    try {
        // Fine List Of data 
        await Urlsave.URl_ShortDonload_data((cb) => {
            if (cb.Status === 'suc') {

                // Make a Header in Excel file
                const formattedData = cb.data.map((url, index) => ({
                    "SNo.": index + 1,
                    "ID": url.U_URl_ID,
                    "Long URL": url.long_URL,
                    "Short URL": `${Config.BASE_URL}/${url.short_URL}`,
                    "Date": moment(url.Date).format('DD MMMM YYYY, h:mm:ss a')
                }));

                const fields = ['SNo.', 'ID', 'Long URL', 'Short URL', 'Date'];
                const csv = json2csv(formattedData, { fields });

                // Save The Excel file in your Divices
                const filePath = path.join(__dirname, '../downloads/URLShortener.xlsx');

                // Write the CSV file to the specified path
                fs.writeFileSync(filePath, csv);

                // Download the CSV file with the correct filename
                res.download(filePath, 'URLShortener.csv', (err) => {
                    if (err) {
                        req.flash("Error downloading the file:", err);
                        res.status(500).redirect("/error_404");
                    } else {
                        // Delete the file after download
                        fs.unlinkSync(filePath);
                    }
                });
            } else {
                req.flash("error", cb.Msg);
                res.status(500).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error downloading the URL list:", error);
        res.status(500).redirect("/error_404");
    }
});

// Filtered URL
router.post(["/url-list/filtered-url-list"], async (req, res) => {
    try {
        const startDate = req.body.startDate;
        await Urlsave.URl_Shortener_filter(startDate, req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                return res.status(200).render("../views/shortener/filtered.ejs", {
                    title: "URL List Filtered",
                    Data: cb.Data,
                    currentPage: cb.currentPage,
                    totalPages: cb.totalPages,
                    pageSize: cb.pageSize,
                    startDate: startDate
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(500).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error fetching URL data:", error);
        res.status(500).redirect("/error_404");
    }
});

// Fillter Url Dowload 
router.get(["/url-list/filtered-url-list/donwload/:startDate"], async (req, res) => {
    try {
        const startDate = req.params.startDate;
        // Fetch filtered data
        await Urlsave.URl_Short_filter_data(startDate, (cb) => {
            if (cb.Status === 'suc') {
                // Format the data for CSV
                const formattedData = cb.Data.map((url, index) => ({
                    "SNo.": index + 1,
                    "ID": url.U_URl_ID,
                    "Long URL": url.long_URL,
                    "Short URL": `${Config.BASE_URL}/${url.short_URL}`,
                    "Date": moment(url.Date).format('DD MMMM YYYY, h:mm:ss a')
                }));

                const fields = ['SNo.', 'ID', 'Long URL', 'Short URL', 'Date'];
                const csv = json2csv(formattedData, { fields });

                // Define the path to save the CSV file
                const filePath = path.join(__dirname, '../downloads/FilteredURLs.csv');

                // Write the CSV file to the specified path
                fs.writeFileSync(filePath, csv);

                // Download the CSV file with the correct filename
                res.download(filePath, 'FilteredURLs.csv', (err) => {
                    if (err) {
                        req.flash("Error downloading the file:", err);
                        res.status(500).redirect("/error_404");
                    } else {
                        // Delete the file after download
                        fs.unlinkSync(filePath);
                    }
                });
            } else {
                req.flash("error", cb.Msg);
                res.status(500).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error downloading the filtered URL list:", error);
        res.status(500).redirect("/error_404");
    }
});

// Rout For URl Visiter Pages
router.get(["/visiter", "/url-visiter"], async (req, res) => {
    try {
        await urlvisiter.URl_Visiter_data(req.page, req.pageSize, (cb) => {
            return res.status(200).render("../views/shortener/url-visiter.ejs", {
                title: "URL Visiter",
                Data: cb.data,
                currentPage: cb.currentPage,
                totalPages: cb.totalPages,
                pageSize: cb.pageSize
            });
        });
    } catch (error) {
        req.flash("Error For the URL Not Working:", error);
        res.status(500).redirect("/error_404");
    }
});

// Download Url File 
router.get(["/visiter/download"], async (req, res) => {
    try {
        // Fine List Of data 
        await urlvisiter.URl_Visiter_Download((cb) => {
            if (cb.Status === 'suc') {

                // Make a Header in Excel file
                const formattedData = cb.data.map((url, index) => ({
                    "SNo.": index + 1,
                    "ID": url.U_URl_ID,
                    "Long URL": url.long_URL,
                    "Short URL": `${Config.BASE_URL}/${url.short_URL}`,
                    "Date": moment(url.Date).format('DD MMMM YYYY, h:mm:ss a'),
                    "IP": url.requestDetails.ip,
                    "Platform": url.requestDetails.userAgentInfo.platform,
                    "Browser": url.requestDetails.userAgentInfo.browser,
                    "Time of Visit": url.requestDetails.timeOfVisit,
                    "Previous URL": url.requestDetails.previousUrl,
                    "Current URL": url.requestDetails.currentUrl,
                    "User Agent Info": Object.entries(url.requestDetails.userAgentInfo.is)
                        .filter(([key, value]) => value)
                        .map(([key]) => key)
                        .join(', ') || 'None'
                }));

                const fields = ['SNo.', 'ID', 'Long URL', 'Short URL', 'Date', 'IP', 'Platform', 'Browser', 'Time of Visit', 'Previous URL', 'Current URL', 'User Agent Info'];
                const csv = json2csv(formattedData, { fields });

                // Save The Excel file in your Divices
                const filePath = path.join(__dirname, '../downloads/URLVisiter.xlsx');

                // Write the CSV file to the specified path
                fs.writeFileSync(filePath, csv);

                // Download the CSV file with the correct filename
                res.download(filePath, 'URLVisiter.csv', (err) => {
                    if (err) {
                        req.flash("Error downloading the file:", err);
                        res.status(500).redirect("/error_404");
                    } else {
                        // Delete the file after download
                        fs.unlinkSync(filePath);
                    }
                });
            } else {
                req.flash("error", cb.Msg);
                res.status(500).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error downloading the URL list:", error);
        res.status(500).redirect("/error_404");
    }
});

// Filtered URL
router.post(["/visiter/filtered-url-list"], async (req, res) => {
    try {
        const startDate = req.body.startDate;
        await urlvisiter.URl_visiter_filter(startDate, req.page, req.pageSize, (cb) => {
            if (cb.Status === "suc") {
                return res.status(200).render("../views/shortener/visiter_filtered.ejs", {
                    title: "URL Visiter Filter",
                    Data: cb.Data,
                    currentPage: cb.currentPage,
                    totalPages: cb.totalPages,
                    pageSize: cb.pageSize,
                    startDate: startDate
                });
            } else {
                req.flash("error", cb.Msg);
                return res.status(500).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error fetching URL data:", error);
        res.status(500).redirect("/error_404");
    }
});

// Fillter Url Dowload 
router.get(["/visiter/filtered-url-list/donwload/:startDate"], async (req, res) => {
    try {
        const startDate = req.params.startDate;
        const result = await urlvisiter.URl_Visiter_filter_data_download(startDate, (cb) => { });

        if (result.Status === 'suc') {
            if (!result.Data) {
                throw new Error('Data is undefined');
            }
            const formattedData = result.Data.map((url, index) => ({
                "SNo.": index + 1,
                "ID": url.U_URl_ID,
                "Long URL": url.long_URL,
                "Short URL": `${Config.BASE_URL}/${url.short_URL}`,
                "Date": moment(url.Date).format('DD MMMM YYYY, h:mm:ss a'),
                "IP": url.requestDetails.ip,
                "Platform": url.requestDetails.userAgentInfo.platform,
                "Browser": url.requestDetails.userAgentInfo.browser,
                "Time of Visit": moment(url.requestDetails.timeOfVisit).format('YYYY-MM-DD HH:mm:ss'),
                "Previous URL": url.requestDetails.previousUrl,
                "Current URL": url.requestDetails.currentUrl,
                "User Agent Info": Object.entries(url.requestDetails.userAgentInfo.is)
                    .filter(([key, value]) => value)
                    .map(([key]) => key)
                    .join(', ') || 'None'
            }));

            const fields = ['SNo.', 'ID', 'Long URL', 'Short URL', 'Date', 'IP', 'Platform', 'Browser', 'Time of Visit', 'Previous URL', 'Current URL', 'User Agent Info'];
            const csv = json2csv(formattedData, { fields });

            const filePath = path.join(__dirname, '../downloads/FilteredURLs.csv');
            fs.writeFileSync(filePath, csv);

            res.download(filePath, 'FilteredURLs.csv', (err) => {
                if (err) {
                    req.flash("Error downloading the file:", err);
                    res.status(500).redirect("/error_404");
                } else {
                    fs.unlinkSync(filePath);
                }
            });
        } else {
            req.flash("error", result.Msg);
            res.status(500).redirect("/error_404");
        }
    } catch (error) {
        req.flash("Error downloading the filtered URL list:", error);
        res.status(500).redirect("/error_404");
    }
});

// Route to handle redirection from shortened URL to original URL
router.get('/:shortID', async (req, res) => {
    try {
        const shortID = req.params.shortID;

        await Urlsave.getOriginalUrl(shortID, (cb) => {
            if (cb.Status === 'suc') {
                res.redirect(cb.originalURL);
            } else {
                req.flash("error", cb.Msg);
                res.status(404).redirect("/error_404");
            }
        });
    } catch (error) {
        req.flash("Error redirecting to original URL:", error);
        res.status(500).redirect("/error_404");
    }
});


// Export the Rout Functions
module.exports = router;