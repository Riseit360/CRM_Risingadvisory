const mongoose = require('mongoose');
var config = require("./config.json");

// Promise For Global
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);

// DataBase URL Online
mongoose.connect(config.Databased.OnlineURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

// Mongoose Connection
const connectDB = mongoose.connection;

// Connection Error And Success Message
connectDB.on("error", (error) => console.log("Database connection error:", error));
connectDB.once("open", () => console.log("Database connected"));

// Export Functions
module.exports = connectDB;