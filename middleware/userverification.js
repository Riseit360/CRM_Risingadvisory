const express = require('express');
const jwt = require('jsonwebtoken');

var config = require("../config/config.json");

class UserVerification {

    // Middleware to check if the user is logged in
    checkcookie = async (req, res, next) => {
        if (res.locals.is_User) {
            next();
        } else {
            req.flash("error", "Log In First");
            return res.status(401).redirect("/auth/login");
        }
    };

    // Middleware to prevent logged-in users from accessing login pages
    checkuserexicte = async (req, res, next) => {
        if (res.locals.is_User === false || res.locals.is_User === undefined) {
            next();
        } else {
            req.flash("error", "First Log out");
            return res.status(403).redirect("/auth/logout");
        }
    };

    // Middleware to authenticate JWT token
    authenticateToken = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).redirect("/auth/login");
            }

            const secret = config.TOKEN_SECRET;
            if (!secret) {
                throw new Error("TOKEN_SECRET is not defined");
            }

            const decoded = jwt.verify(token, secret);
            res.locals.user = decoded; // Store user information in res.locals
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).redirect("/auth/login");
        }
    };

    // Extract user ID from the token
    UserID = async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const secret = config.TOKEN_SECRET;
            if (!secret) {
                throw new Error("TOKEN_SECRET is not defined");
            }
            const decoded = jwt.verify(token, secret);
            return decoded; // Return the decoded token information
        } catch (error) {
            console.error("Error extracting user ID:", error);
            return null; // Return null or handle as needed
        }
    }
}

module.exports = new UserVerification();