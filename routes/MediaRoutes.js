// Express Route module import 
var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { DownloaderHelper } = require('node-downloader-helper');


// File and Funtions import
const LibraryController = require('../controllers/media/LibraryController')


// File canvert in object
const Media = new LibraryController();


// Ensure the destination folder exists
const directory = path.join(__dirname, '..', 'public', 'media');
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directory); // Use the defined directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter to allow specific file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv|mp3|wav|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

// Initialize multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });



// Media Router
router.get(["/library", "/Library"], async (req, res) => {
    try {
        return res.status(200).render("../views/media/library.ejs", {
            title: "Library"
        });
    } catch (error) {
        req.flash('Request Access Control For Pages', error);
        return res.status(200).redirect("/error_404");
    }
})

// Add media Router
router.get(["/add-media", "/add_media", "/add-library", "add_library"], async (req, res) => {
    try {
        return res.status(200).render("../views/media/add-media.ejs", {
            title: "Add Media"
        });
    } catch (error) {
        req.flash('Request Access Control For Pages', error);
        return res.status(200).redirect("/error_404");
    }
})







// Update for media in dir and Database
router.post(["/UploadMedia"], upload.fields([{ name: 'Drop_and_down_img', }, { name: 'uplod_sinng_img', }, { name: 'uplod_directory_img', }]), async (req, res) => {
    try {
        const UserTRackUID = req.requestData.UID;

        // Get the uploaded files and other form data
        const files = req.files;
        console.log("🚀 ~ file: MediaRoutes.js:89 ~ router.post ~ files:", files)
        const imageUrls = req.body.uplod_URl_sinng_img;

        /*    // Define a file name and path to save the image
            const fileName = `url-image-${Date.now()}.png`; // Modify the file extension if necessary
            const savePath = path.join(__dirname, '..', 'public', 'media', fileName);


            // Download image if URL is provided
            if (imageUrl) {
                const dl = new DownloaderHelper(imageUrl, savePath);
                dl.on('end', () => console.log('Download Completed'));
                dl.on('error', (err) => console.log('Download Failed', err));
                await dl.start();
            }

            // Download and save the image using the LibraryController's method
            await Media.downloadImage(imageUrl, savePath); */

        // Handle saving files to the database
        await Media.addLibrary(UserTRackUID, files, imageUrls, (err, response) => {
            if (err) {
                // Handle the error
                console.error("Error saving library data:", err.message);
                req.flash('Error', err.message);
                return res.status(500).redirect("/error_404");
            } else {
                // Handle successful response
                req.flash('Success', response.Msg);
                return res.status(200).redirect("/media/library");
            }
        });

        // Redirect to media library or send success response
        res.status(200).redirect("/media/library");

    } catch (error) {
        console.error("Error uploading files:", error.message);
        req.flash('Request Access Control For Pages', error.message);
        return res.status(200).redirect("/error_404");
    }
});



// Export the Rout Functions
module.exports = router;