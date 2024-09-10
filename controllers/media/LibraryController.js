// Express Rout module import 
var express = require('express');
var uuid = require("uuid");
const path = require('path');
const fs = require('fs');

const Media = require('../../module/librarymodule');

class LibraryApi {

    // Download
    async downloadImage(imageUrl, savePath) {
        try {
            const response = await axios({
                url: imageUrl,
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(savePath, response.data);
            console.log(`Image downloaded and saved to ${savePath}`);
        } catch (error) {
            console.error("Error downloading image:", error.message);
            throw error;
        }
    }

    // Save Media File
    async addLibrary(UserTRackUID, files, imageUrls, cb) {
        try {
            // Combine all files into a single array
            const fileDataList = [
                ...(files.Drop_and_down_img || []),
                ...(files.uplod_sinng_img || []),
                ...(files.uplod_directory_img || [])
            ];

            // Initialize libraryData array
            const libraryData = fileDataList.map(fileData => {
                const filename = path.basename(fileData.path); // Extract the filename from the full path
                return {
                    U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                    filename: filename,
                    type: fileData.mimetype,
                    size: fileData.size || 0, // Default size to 0 if not available
                    path: `/media/${filename}`, // Save the relative path of the file
                    uploadedAt: new Date(),
                    UserAgentID: UserTRackUID,
                };
            });

            // Handle the imageUrl if provided
            if (imageUrls) {
                libraryData.push({
                    U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                    filename: path.basename(imageUrls), // Use path.basename to get the filename from the URL
                    type: 'url', // Mark the type as 'url' for the imageUrl
                    size: 0, // Since it's a URL, size is not applicable
                    uploadedAt: new Date(),
                    UserAgentID: UserTRackUID,
                    path: imageUrls // Save the URL as is
                });
            }

            // Save the new data to the database
            await Media.insertMany(libraryData);
            console.log("🚀 ~ file: LibraryController.js:69 ~ LibraryApi ~ Library data saved ~ libraryData:", libraryData);

            return cb(null, { Status: "ok", Msg: "Library saved successfully", data: libraryData });

        } catch (error) {
            console.error("Error saving library data:", error.message);
            return cb({ Status: "err", Msg: "Error saving library data", data: error });
        }
    }

}

module.exports = LibraryApi;