// Express Rout module import 
var express = require('express');
var router = express.Router();


// File and Funtions import 
const BodyComponent = require('../middleware/bodycomponent');
const otpauthemail = require('../controllers/developer-settings/otpauthcontroller.js')
const signupController = require('../controllers/auth/signup')
const OtpGenerator = require('../helper/otp-generator')
const HashedGenerator = require('../helper/hashed')
var UserAgent = require("../middleware/useragent");
var UserVerification = require("../middleware/userverification.js");
var JWT = require("../helper/jwt.js");


// File canvert in object
const bodydata = new BodyComponent();
const otpemail = new otpauthemail();
const singup = new signupController();
var jwt = new JWT();



// User Login Post Rout
router.post(["/authuserLogin"], bodydata.requireAuth, UserVerification.checkuserexicte, async (req, res) => {
    try {
        const data = req.body;
        // Perform user login
        singup.UserLogin(data, async (response) => {
            if (response.Status === 'suc') {
                // Generate JWT token and set cookies
                const token = jwt.generateAccessToken({ uid: response.User.U_URl_ID });
                res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
                res.cookie('UserName', response.User.Name, { maxAge: 60 * 60 * 1000, httpOnly: true });
                req.session.Roll = response.User.Iam; // Adjust as needed

                // Store username in session
                req.session.UserName = response.User.Name;
                req.session.Roll = response.User.Iam;

                req.flash('success', 'Logged in successfully');
                return res.status(200).redirect('/dashboard');

            } else {
                req.flash('error', response.Msg);
                return res.status(200).redirect('/');
            }

        });
    } catch (error) {
        req.flash('Error processing login request:', error);
        return res.status(500).redirect('/error_404');
    }
});

// Route to log out
router.get(["/logout"], (req, res) => {
    try {
        res.cookie("token", null, { expires: new Date(0), httpOnly: true });
        res.clearCookie("token");
        res.cookie("UserName", null, { expires: new Date(0), httpOnly: true });
        res.clearCookie("UserName");
        req.session.tim = null;
        res.locals.is_User = false;
        req.session.Roll = null;

        // Clear cookies
        res.clearCookie("token");
        res.clearCookie("UserName");

        req.flash('success', 'Logged Out successfully');
        return res.status(200).redirect("/LogIn");

    } catch (error) {
        req.flash('Error processing Log Out request:', error);
        return res.status(500).redirect('/error_404');
    }
});

// Sign Up Pages 
router.get(["/signup", "/sign-up", "/Sign-Up", "/sign_up", "/Sign_Up", "/Sign up", "/sign up"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        // Render form view
        return res.status(200).render("../views/accounts/signup.ejs", {
            title: "Sign Up"
        });

    } catch (error) {
        // Redirect to another error page
        req.flash('Request AuthenticatedsRoutes For signup', error);
        return res.status(200).redirect("/error_404");
    }
});

// Post Sign Up Pages
router.post(["/create-account"], bodydata.requireAuth, OtpGenerator.randomOTPGenerator, UserAgent.analyzely, UserVerification.checkuserexicte, async (req, res) => {
    try {
        // body Data and Otp
        const data = req.body;
        const OTP = req.session.OTP;
        const userAgentData = req.requestData;
        const UserTRackUID = req.requestData.UID;
        const siteUrl = `${req.protocol}://${req.get('host')}`;

        // Convert the data object to a JSON string and Cout the Lenght
        const dataString = JSON.stringify(data);
        const characterCount = dataString.length;

        // Hash the password
        const hashedPassword = await HashedGenerator.hashPassword(data, characterCount);

        // Send OTP email
        otpemail.SendEmailOtp(data, OTP, userAgentData, siteUrl, (response) => {
            if (response.Status === "Suc") {
                // Render success page
                req.flash('Email Send successfully.');
            } else {
                // Render error page wit`h error message
                req.flash('Error while Emailnot send:', response.Msg);
            }
        });

        singup.SignUpUser(data, OTP, hashedPassword, UserTRackUID, (response) => {
            if (response.Status === "Suc") {
                req.flash('User signed up successfully.');
            } else {
                req.flash('Error while signing up user:', response.Msg);
            }
        });

        return res.status(200).render("../views/accounts/otp-verification.ejs", {
            title: "Sign Up",
            otp: OTP,
            userData: data

        });

    } catch (error) {
        // Handle unexpected errors
        req.flash('Error processing sign-up request:', error);
        res.status(500).render("../views/accounts/error.ejs", {
            title: "Error",
            message: error.message || "An unexpected error occurred."
        });
    }
});

// Otp Verify  For Create USer 
router.post(["/OTP-Verify"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        const userOtp = req.body.OTP;
        const userAgentData = req.requestData;

        // Verify the OTP
        singup.OTpVerify(userOtp, userAgentData, (error, response) => {
            if (error) {
                req.flash('OTP verification failed:', error);
                return res.status(400).json({ message: error.Msg });
            }
            res.redirect('/login');
        });

    } catch (error) {
        req.flash('Request Authenticated Routes For POST user login', error);
        return res.status(500).redirect('/error_404');
    }
});

// Forget Password pages 
router.get(["/forget-password", "/forget_password", "/Forget_Password", "/Forget-Password", "/ForgetPassword", "/forgetpassword", "/Forget Password", "/forget password"], UserVerification.checkuserexicte, async (req, res) => {
    try {

        // Render form view
        return res.status(200).render("../views/accounts/forget-password.ejs", {
            title: "Forget Password"
        });
    } catch (error) {
        // Redirect to another error page
        req.flash('Request AuthenticatedsRoutes For Forget Password', error);
        return res.status(200).redirect("/error_404");
    }
});

// Forget Password And Otp Post Rout
router.post(["/passwordforget"], bodydata.requireAuth, OtpGenerator.randomOTPGenerator, UserAgent.analyzely, UserVerification.checkuserexicte, async (req, res) => {
    try {
        const data = req.body;
        const OTP = req.session.OTP;
        const userAgentData = req.requestData;
        const UserTRackUID = req.requestData.UID;
        const siteUrl = `${req.protocol}://${req.get('host')}`;

        // Send OTP email
        otpemail.SendEmailOtp(data, OTP, userAgentData, siteUrl, (response) => {
            if (response.Status === "Suc") {
                req.flash('Email sent successfully.');
            } else {
                req.flash('Error while sending email:', response.Msg);
            }
        });

        // Perform user forget password
        singup.UserForgetPassword(data, UserTRackUID, OTP, async (response) => {
            if (response.Status === "suc") {
                req.flash('User forget password processed successfully.');
            } else {
                req.flash('Error while processing forget password:', response.Msg);
            }
        });

        return res.status(200).render("../views/accounts/forget-otp-password.ejs", {
            title: "Forget Password",
            otp: OTP,
            userData: data
        });

    } catch (error) {
        req.flash('Error processing forget password request:', error);
        res.status(500).render("../views/accounts/error.ejs", {
            title: "Error",
            message: error.message || "An unexpected error occurred."
        });
    }
});

// Otp Verify  For Create USer 
router.post(["/OTP-Verify-forget-password"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        const userOtp = req.body;
        const userAgentData = req.requestData;

        // Verify the OTP
        singup.OTpVerifyForgetPassword(userOtp, userAgentData, (error, response) => {
            if (error) {
                req.flash('OTP verification failed:', error);
                return res.status(400).json({ message: error.Msg });
            }
            // Render OTP page
            return res.status(200).render('../views/accounts/update-password.ejs', {
                title: 'Update Password',
                data: userOtp
            });
        });

    } catch (error) {
        req.flash('Request Authenticated Routes For POST user login', error);
        return res.status(500).redirect('/error_404');
    }
});

// Create Password pages 
router.get(["/create-password", "/Create-Password", "/create_password", "/Create-Password", "/create password", "/Create Password", "/createpassword", "/CreatePassword"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        // Render form view
        return res.status(200).render("../views/accounts/create-password.ejs", {
            title: "Create Password"
        });
    } catch (error) {
        // Redirect to another error page
        req.flash('Request AuthenticatedsRoutes For Create Password', error);
        return res.status(200).redirect("/error_404");
    }
});

// Update New Passowrd
router.post(["/UpdatePassword"], UserVerification.checkuserexicte, async (req, res) => {
    try {
        // Data & Tarcking ID
        const Data = req.body;
        const useragentdata = req.requestData

        // Controller
        singup.UpdatePassword(Data, useragentdata, (error, response) => {
            if (error) {
                req.flash('Password Update failed:', error);
                return res.status(400).json({ message: error.Msg });
            }

            // Render Login Pages
            return res.status(200).redirect('/login');
        });

    } catch (error) {
        req.flash('Request Authenticated Routes For POST user login', error);
        return res.status(500).redirect('/error_404');
    }

});



// Export the Rout Functions
module.exports = router;