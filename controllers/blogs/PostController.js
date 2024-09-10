// Express Rout module import 
var express = require('express');
var uuid = require("uuid");

// File and Functions import  
var paginateData = require('../../helper/pagination');
var BlogsModule = require('../../module/blogsmodule');

// Class for All Functions
class BlogsApi {

    // Method to add a Ndew Psot 
    async postDataSave(data, UserTRackUID, imagePath, cb) {
        try {
            // Create a New Post object Data
            const NewPostData = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Title: data.Page_Title,
                Short_Content: data.short_Content,
                Content: data.Content,
                slug: data.URL_handle,
                Visibility: data.Visibility,
                visibility_Date: data.Visibilitydate,
                Featured_Image: imagePath
            };

            // Save the New Post to the database
            const savedPost = new BlogsModule(NewPostData);
            await savedPost.save();
            console.log("🚀 ~ file: PostController.js:44 ~ BlogsApi ~ postDataSave ~ savedPost:", savedPost)

            return cb({ Status: "suc", Msg: "Post saved successfully", data: savedPost });

        } catch (err) {
            if (err.code === 11000) {
                console.error("Duplicate key error:", err);
                return cb({ Status: "err", Msg: "Duplicate key error: Post must be unique", data: err });
            } else {
                console.error("Error saving Post:", err);
                return cb({ Status: "err", Msg: "Error saving data", data: err });
            }

        }

    }

    // Method to get all Post with pagination
    async PostListData(page, pageSize, cb) {
        try {
            // Post Find
            const PostList = await paginateData(BlogsModule, page, pageSize, { Date: -1 });

            // check sucess Post
            if (PostList.Status === "suc") {
                return cb({
                    Status: "suc",
                    Msg: "PagesList found",
                    data: PostList.data,
                    totalPages: PostList.totalPages,
                    currentPage: page,
                    pageSize
                });
            } else {
                return cb({
                    Status: "err",
                    Msg: "No data found",
                    data: [],
                    totalPages: 0,
                    currentPage: page,
                    pageSize
                });
            }

        } catch (err) {
            console.error("Error Retrieving Pages:", err);
            return cb({ Status: "err", Msg: "Error retrieving data", data: err });
        }
    }

    // Get all List In Single
    async getPostData() {
        try {
            const BlogsData = await BlogsModule.find();
            return { status: 'success', data: BlogsData };
        } catch (error) {
            return { status: 'error', message: error.message };
        }
    }

    // Status Update 
    async PostStatus(UrlId, UserTRackUID, cb) {
        try {
            // Find a Data In URL ID
            const statusPost = await BlogsModule.findOne({ U_URl_ID: UrlId });

            if (!statusPost) {
                return cb({ Status: "err", Message: "Post not found." });
            }

            // Check Active and Not Active && and Update to status
            const UpdateStatus = !statusPost.isActive;
            await BlogsModule.findOneAndUpdate({ U_URl_ID: UrlId }, { $set: { isActive: UpdateStatus, UserAgentID: UserTRackUID } }, { new: true })

            // Callback with success status
            return cb({ Status: "suc", Message: "Post status updated successfully." });

        } catch (error) {
            console.error("Error updating Post status:", err);
            return cb({ Status: "err", Message: "Error updating data", data: err });
        }
    }

    // Delete Post
    async DeletePost(UrlId, cb) {
        try {
            // Find And Delete
            const PostDelete = await BlogsModule.deleteOne({ U_URl_ID: UrlId });

            // Check and Delete
            if (PostDelete.deletedCount === 1) {
                return cb({ Status: "suc", Msg: "Post deleted successfully" });
            } else {
                return cb({ Status: "err", Msg: "Post not found or not deleted" });
            }

        } catch (error) {
            console.error("Error Deleting Post:", err);
            return cb({ Status: "err", Msg: "Error deleting data", data: err });
        }
    }

    // Find A Post
    async updateposts(UrlId, cb) {
        try {
            // Find the Post by U_URl_ID
            const UpdatePostData = await BlogsModule.findOne({ U_URl_ID: UrlId });

            if (!UpdatePostData) {
                // Post not found
                return cb({ Status: "err", Msg: "Postt not found", data: null });
            }
            // Post found successfully
            return cb({ Status: "suc", Msg: "Post data retrieved successfully", data: UpdatePostData });

        } catch (error) {

            console.error("Error retrieving Post data:", error);
            return cb({ Status: "err", Msg: "Error retrieving Post data", data: null });
        }
    }

    // Update Post Data
    async PostUpdateData(UrlId, data, imagePath, UserTRackUID, callback) {
        try {
            // Input Value Save
            const PostDataUpdate = {
                U_URl_ID: uuid.v4().replace(/-/g, "").substring(0, 12),
                UserAgentID: UserTRackUID,
                Title: data.Page_Title,
                Short_Content: data.short_Content,
                Content: data.Content,
                slug: data.URL_handle,
                Visibility: data.Visibility,
                visibility_Date: data.Visibilitydate,
                Featured_Image: imagePath
            };

            // Update the Post in the database
            const result = await BlogsModule.findOneAndUpdate({ U_URl_ID: UrlId }, PostDataUpdate, { new: true });

            if (result) {
                return callback({ Status: "suc", Msg: "Post updated successfully." });
            } else {
                return callback({ Status: "fail", Msg: "POst not found or no changes detected." });
            }

        } catch (error) {
            console.error("Error updating Post:", error);
            return callback({ Status: "fail", Msg: "Error updating Post: " + error.message });
        }
    }

}

module.exports = BlogsApi;