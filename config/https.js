// packages & file import
var fs = require("fs");


// Cannect SSL Key 
var httpsOptions = {
    key: fs.readFileSync("./ssl" + "/key.pem"),
    cert: fs.readFileSync("./ssl" + "/key-cert.pem")
}


// Export Funtions
module.exports = httpsOptions;