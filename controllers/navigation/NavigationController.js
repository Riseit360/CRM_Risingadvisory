// Import necessary modules
const express = require('express');
const uuid = require('uuid');
const moment = require('moment'); // Evaluate if moment is necessary for your use case
const NavigationModule = require('../../module/NavigationModule');
const paginateData = require('../../helper/pagination');

// Navigation API class for handling all operations related to navigation menus
class NavigationApi {

    // Method to save a new menu
    async AddMenuData(data, UserTrackUID, cb) {
        try {
            // Prepare the data to be saved
            const MenuData = {
                U_URl_ID: uuid.v4().replace(/-/g, '').substring(0, 12), // Generate a unique ID
                UserAgentID: UserTrackUID,
                Menu_Name: data.Menu_name,
                Menu_Json: data.Menu_json,
                Visibility: data.visibility,
                Visibility_Date: data.visibility_date || moment().toISOString() // Use moment if necessary
            };

            // Save the menu data to the database
            const MenuSave = new NavigationModule(MenuData);
            await MenuSave.save();

            return cb({ Status: 'suc', Msg: 'Menu saved successfully' });

        } catch (error) {
            console.error("Error saving Menu:", error);
            return cb({ Status: 'err', Msg: 'Error while saving Menu Data', error });
        }
    }

    // Method to get all navigation menus with pagination
    async AllNavList(page, pageSize, cb) {
        try {
            const NavList = await paginateData(NavigationModule, page, pageSize, { Visibility_Date: -1 });

            if (NavList.Status === 'suc') {
                return cb({
                    Status: 'suc',
                    Msg: 'Menus found',
                    data: NavList.data,
                    totalPages: NavList.totalPages,
                    currentPage: page,
                    pageSize
                });
            } else {
                return cb({
                    Status: 'err',
                    Msg: 'No menus found',
                    data: [],
                    totalPages: 0,
                    currentPage: page,
                    pageSize
                });
            }

        } catch (err) {
            console.error("Error retrieving menus:", err);
            return cb({ Status: 'err', Msg: 'Error retrieving menus', data: err });
        }
    }

    // Data GEt 
    async navigationData() {
        try {
            const NavDataList = await NavigationModule.find();
            return { status: 'success', data: NavDataList };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Delete navigation Data in one by one
    async navigationDelete(UrlId, cb) {
        try {
            // Match Nad delete URl List
            const deleteNavData = await NavigationModule.deleteOne({ U_URl_ID: UrlId });

            if (deleteNavData.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Menu deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Menu not found or not deleted" });
            }

        } catch (error) {
            console.error("Error retrieving original URL:", error);
            return cb({ Status: 'err', Msg: 'Error retrieving original URL' });
        }
    }

    // Update For Statues
    async Navigationtatus(UrlId, cb) {
        try {
            // Find the Navigation by U_URl_ID
            const NavStatusUpdate = await NavigationModule.findOne({ U_URl_ID: UrlId });

            if (!NavStatusUpdate) {
                return cb({ Status: "err", Message: "Navigation not found." });
            }

            // Toggle the isActive status
            const newStatus = !NavStatusUpdate.isActive;
            await NavigationModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: newStatus } }, { new: true });

            // Callback with success status
            return cb({ Status: "suc", Message: "Navigation status updated successfully." });

        } catch (err) {
            console.error("Error updating Navigation status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Find A DepartMent
    async updatenavigatione(UrlId, cb) {
        try {
            // Find the User by U_URl_ID
            const navigationData = await NavigationModule.findOne({ U_URl_ID: UrlId });

            if (!navigationData) {
                // User not found
                return cb({ Status: "err", Msg: "Navigation not found", data: null });
            }
            // User found successfully
            return cb({ Status: "suc", Msg: "Navigation data retrieved successfully", data: navigationData });
        } catch (error) {

            console.error("Error retrieving user data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Navigation", data: null });
        }
    }

    // Update DepartMent Data
    async updateNavData(UrlId, data, UserTRackUID, callback) {
        try {
            // Input Value Save
            const updateNavSave = {
                U_URl_ID: uuid.v4().replace(/-/g, '').substring(0, 12),
                UserAgentID: UserTRackUID,
                Menu_Name: data.Menu_name,
                Menu_Json: data.Menu_json,
                Visibility: data.visibility,
                Visibility_Date: data.visibility_date || moment().toISOString()
            };

            // Update the Navigation in the database
            const result = await NavigationModule.findOneAndUpdate({ U_URl_ID: UrlId }, updateNavSave, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Navigation updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "Navigation not found or no changes detected." });
            }
        } catch (error) {
            console.error("Error updating Navigation:", error);
            return callback({ Status: "fail", Msg: "Error updating Navigation: " + error.message });
        }
    }

}

module.exports = NavigationApi;