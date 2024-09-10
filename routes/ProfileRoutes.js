// Express Rout module import 
var express = require('express');
var router = express.Router();

// File and Funtions import
var UserAgent = require("../middleware/useragent");
const BodyComponent = require('../middleware/bodycomponent');
const CollaboratorsController = require('../controllers/Collaborators/usercontroler')


// File canvert in object
const bodydata = new BodyComponent();
const userdata = new CollaboratorsController();



// Helper function to get Job Profile data
const getprofiledata = async () => {
    const response = await userdata.getProfileData();
    if (response.status === 'success') {
        return response.data;
    } else {
        throw new Error(response.message);
    }
};





// User Profile Rout
router.get(["/your-profile", "/your_profile"], async (req, res) => {
    try {

        // Fetching Job Profile Data
        const UserProfile = await getprofiledata();
        const userProfileData = UserProfile[0];

        return res.status(200).render("../views/profile/your-profile.ejs", {
            title: "User Profile",
            userProfileData
        })

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add User', error);
        return res.status(500).redirect("/error_404");
    }
});

// User Profile Rout
router.get(["/edit-profile", "/edit_profile"], async (req, res) => {
    try {

        // Fetching Job Profile Data
        const UserProfile = await getprofiledata();
        const userProfileData = UserProfile[0];

        return res.status(200).render("../views/profile/edit-profile.ejs", {
            title: "User Profile",
            userProfileData
        })

    } catch (error) {
        // Redirect to another error page 
        req.flash('Request AuthenticatedsRoutes For Add User', error);
        return res.status(500).redirect("/error_404");
    }
});




// Export the Rout Functions
module.exports = router;