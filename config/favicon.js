// packages & file import
var favicon = require('serve-favicon');

// FavIcon Import 
module.exports = function (app) {
    try {
        app.use(favicon("./public/images/favicon.ico"));
    } catch (error) {
        console.error('Error in favicon config:', error);
    }
}