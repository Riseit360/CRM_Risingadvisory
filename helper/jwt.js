// Express Rout module import 
var jwt = require('jsonwebtoken');

// File and Funtions import 
var config = require("../config/config.json");

// Class
class JWT {

    async generateAccessToken(UserData) {
        var data = await jwt.sign(UserData, config.TOKEN_SECRET);
        return data;
    }
    async getUID(token) {
        var output2 = await jwt.verify(token, config.TOKEN_SECRET);
        return output2;
    }
}

module.exports = JWT;