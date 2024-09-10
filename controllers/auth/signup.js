// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const moment = require('moment');
const bcrypt = require('bcrypt');

// File and Funtions import 
var SignUpModule = require('../../module/signup');
var UserModule = require('../../module/UserModule');
const ForPassdModule = require('../../module/forget-possword');
const HashedGenerator = require('../../helper/hashed')


// Class for All Funtions
class SignUpAuthApi {

    // save blog post
    async SignUpUser(data, OTP, hashedPassword, UserTRackUID, cb) {

        try {
            //  Input Value Save 
            const UserData = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Iam: data.Iam,
                Name: data.Name,
                Mobile_Number: data.MobileNumber,
                Password: hashedPassword,
                Email_Id: data.Email,
                AgreePolicy: data.AgreePolicy,
                OTP: OTP,
                OTP_Expiry: moment().add(10, 'minutes').toDate()
            };

            // Save to Database
            const UserSingUpSave = new SignUpModule(UserData);
            await UserSingUpSave.save();

            return cb({ Status: "suc", Msg: "User Data saved successfully" });

        } catch (error) {

            console.error("Error saving URL:", error);
            return cb({ Status: "err", Msg: "Error while saving user data" });
        }

    }

    // Verify OTP
    async OTpVerify(userOtp, userAgentData, cb) {
        try {
            // Data Save in Databased
            const user = await SignUpModule.findOne({ OTP: userOtp });

            // matched the user
            if (user) {
                // OTP Verify to True
                user.isVerified = true;
                user.UserAgentID = userAgentData.UID;

                // Data Save to OTP Verify
                await user.save();

                // Retun Call Back
                return cb(null, { Status: "suc", Msg: "OTP verified successfully" });
            } else {
                // OTP does not match any record
                return cb({ Status: "err", Msg: "Invalid OTP" });
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            return cb({ Status: "err", Msg: "Error verifying OTP", data: err });
        }
    }

    // User Login
    async UserLogin(data, cb) {
        try {

            // Email And Password 
            const { Email, Password } = data;

            // Find user by email in both SignUpModule and UserModule
            //const userFromSignUpModule = await SignUpModule.findOne({ Email_Id: Email });
            const userFromUserModule = await UserModule.findOne({ Email: Email });

            // Determine which user data to use
            //const user = userFromSignUpModule || userFromUserModule;
            const user = userFromUserModule;

            // If no user is found in either module, return an error
            if (!user) {
                return cb({ Status: 'err', Msg: 'User not found', User: null });
            }

            // Verify the password
            const isMatch = await bcrypt.compare(Password, user.Password);

            // If the password does not match, return an error
            if (!isMatch) {
                return cb({ Status: 'err', Msg: 'Invalid password', User: null });
            }

            // If the login is successful, return the user data
            return cb({ Status: 'suc', Msg: 'Logged in successfully', User: user });
        } catch (error) {
            console.error('Error checking login details:', error);
            cb({ Status: 'err', Msg: 'Error while checking login details', User: null });
        }
    }

    // User Forget Password
    async UserForgetPassword(data, UserTRackUID, OTP, cb) {
        try {
            const { Email } = data;

            // Find user by email in the database
            const user = await SignUpModule.findOne({ Email_Id: Email });

            if (!user) {
                return cb({ Status: 'err', Msg: 'User not found', User: null });
            }

            // Add records to the ForPassdModule document
            const updateData = {
                U_URl_ID: uuid.v4().replace("-", "").substring(0, 12),
                Email_Id: Email,
                UserAgentID: UserTRackUID.UID,
                OTP: OTP,
                isVerified: false,
                OTP_Expiry: moment().add(10, 'minutes').toDate()
            };
            console.log("🚀 ~ file: signup.js:128 ~ SignUpAuthApi ~ UserForgetPassword ~ updateData:", updateData)

            await ForPassdModule.updateOne({ Email_Id: Email }, { $set: updateData }, { upsert: true });

            // Successful response
            cb({ Status: 'suc', Msg: 'OTP sent successfully', User: user });

        } catch (error) {
            console.error('Error processing forget password request:', error);
            cb({ Status: 'err', Msg: 'Error while processing forget password request', User: null });
        }
    }

    // Forget Password OTP Verify 
    async OTpVerifyForgetPassword(userOtp, userAgentData, cb) {
        try {
            const { email, OTP } = userOtp;;

            // Find the OTP record based on email and OTP
            const OTPVerify = await ForPassdModule.findOne({ Email_Id: email, OTP: OTP });

            // Check if OTPVerify is null
            if (!OTPVerify) {
                console.error('No matching record found for email and OTP');
                return cb({ Status: "err", Msg: "Invalid OTP or email" });
            }

            // Check if OTP has expired
            if (moment().isAfter(OTPVerify.OTP_Expiry)) {
                return cb({ Status: "err", Msg: "OTP has expired" });
            }

            // Update the OTP record
            OTPVerify.isVerified = true;
            OTPVerify.OTP = OTP;
            OTPVerify.UserAgentID = userAgentData.UID;

            // Save the updated record
            await OTPVerify.save();

            return cb(null, { Status: "suc", Msg: "OTP verified successfully" });

        } catch (err) {
            console.error("Error verifying OTP:", err);
            return cb({ Status: "err", Msg: "Error verifying OTP", data: err });
        }
    }

    // Update Password
    async UpdatePassword(Data, useragentdata, cb) {
        try {
            // Get Email & Otp Matched
            const { email, OTP, Password, ConfirmPassword } = Data;;

            // Check if password and confirm password match
            if (Password !== ConfirmPassword) {
                return cb({ Status: 'err', Msg: 'Passwords do not match' });
            }

            // Find the OTP & email matched to databsed
            const updatePass = await ForPassdModule.findOne({ Email_Id: email, OTP: OTP, isVerified: true });


            // NOt matched OTP & Email to databased error Msg
            if (!updatePass) {
                return cb({ Status: 'err', Msg: 'Invalid OTP or OTP not verified' });
            }

            // Find the user by email 
            const user = await SignUpModule.findOne({ Email_Id: email });


            // NOt matched User Email to databased error Ms
            if (!user) {
                return cb({ Status: 'err', Msg: 'User not found' });
            }

            // Convert the data object to a JSON string and Cout the Lenght
            const dataString = JSON.stringify(Data);
            const characterCount = dataString.length;

            // Hash the password
            const hashedPassword = await HashedGenerator.hashPassword(Data, characterCount);


            // Update the user's password
            user.Password = hashedPassword;
            user.UserAgentID = useragentdata.UID;
            await user.save();


            // Optionally, remove the OTP record after successful password update
            await ForPassdModule.deleteOne({ Email_Id: email });

            console.log('Password updated successfully for user:', user);
            return cb(null, { Status: 'suc', Msg: 'Password updated successfully' });


        } catch (error) {
            console.error('Error updating password:', error);
            return cb({ Status: 'err', Msg: 'Error updating password', data: error });
        }

    }


}

module.exports = SignUpAuthApi;