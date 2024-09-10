// Import Express and crypto modules
const express = require('express');
const bcrypt = require('bcrypt');


// Functions Class For Hashed Generation
class HashedGenerator {

    // Method to hash a password with a dynamic salt rounds
    async hashPassword(data, characterCount) {
        try {
            const Password = data.Password;
            const saltRounds = 15;

            // Generate salt
            const salt = await bcrypt.genSalt(saltRounds);

            // Hash the password
            const hashedPassword = await bcrypt.hash(Password, salt);

            return hashedPassword;

        } catch (error) {
            console.error("Error hashing password:", error);
            throw error;
        }
    }



}

// Export the Hashed Generator instance
module.exports = new HashedGenerator();