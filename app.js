// packages & file import
const express = require('express');
var moment = require('moment');
const bodyParser = require('body-parser'); // Add bodyParser
var cors = require('cors')
var ejs = require("ejs");


// Http Server
var https = require("https");
var http = require("http");

// cookieParser And session
var flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const session = require('express-session');

var app = express();

// File Controller for storing 
var httpsOptions = require("./config/https.js");
var favicon = require("./config/favicon.js");
var Connection = require("./config/connection.js");
var checklogin = require("./middleware/userverification.js")

// File and Funtions import
var UserAgent = require("./middleware/useragent");


favicon(app);

// Date and time format
var shortDateFormat = "Do MMMM, YYYY HH:MM:SS";
app.locals.moment = moment;
app.locals.shortDateFormat = shortDateFormat;

//port
var port = process.env.PORT || 3020;

// Set view engine
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(flash());
app.use(cors());
const compression = require('compression');
app.use(compression()); // Compress all HTTP responses

// for http data
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.urlencoded({
    extended: false
}));


// Session Configuration
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'S0m3th1ngV3ryS3cur3',
    resave: false,
    saveUninitialized: false
}));


// app using midelwaer 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    var UserName = req.cookies.UserName;
    var token = req.cookies.token;
    if (token == null) {
        res.locals.is_User = false;
        res.locals.user = "";
        res.locals.UserName = "";

    } else {
        res.locals.user = token;
        res.locals.UserName = UserName;
        res.locals.is_User = true;
        res.locals.Roll = req.session.Roll;
    }
    next();
});


//Public folder to use 
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/assets", express.static(__dirname + "/public/assets"));
app.use("/font", express.static(__dirname + "/public/font"));
app.use("/Images", express.static(__dirname + "/public/images"));
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/uploads", express.static(__dirname + "/public/uploads"));
app.use("/blogs", express.static(__dirname + "/public/blogs"));


//  Routes Path Difitend
app.use("/", UserAgent.analyzely, require("./routes/MainRoutes.js"));
app.use("/developer-settings", checklogin.checkcookie, UserAgent.analyzely, require("./routes/developersettingsRoutes.js"));
app.use("/auth", UserAgent.analyzely, require("./routes/AuthenticatedsRoutes.js"));
app.use("/shortener", checklogin.checkcookie, UserAgent.analyzely, require("./routes/ShortenerRoutes.js"));
app.use("/Profile", checklogin.checkcookie, UserAgent.analyzely, require("./routes/ProfileRoutes.js"));
app.use("/hr", checklogin.checkcookie, UserAgent.analyzely, require("./routes/HrRoutes.js"));
app.use("/Collaborators", checklogin.checkcookie, UserAgent.analyzely, require("./routes/CollaboratorsRoutes.js"));
app.use("/access-control", checklogin.checkcookie, UserAgent.analyzely, require("./routes/AccessControlRoutes.js"));
app.use("/page", checklogin.checkcookie, UserAgent.analyzely, require("./routes/PagesRoutes.js"));
app.use("/navigation", checklogin.checkcookie, UserAgent.analyzely, require("./routes/NavigationRoutes.js"));
app.use("/seo-tool", checklogin.checkcookie, UserAgent.analyzely, require("./routes/SEO_ToolRoutes.js"));
app.use('/blogs', checklogin.checkcookie, UserAgent.analyzely, require('./routes/BlogsRoutes.js'));
app.use('/media', checklogin.checkcookie, UserAgent.analyzely, require('./routes/MediaRoutes.js'));
app.use('/log', checklogin.checkcookie, UserAgent.analyzely, require('./routes/LogRoutes.js'));
app.use('/leads', checklogin.checkcookie, UserAgent.analyzely, require('./routes/LeadsRoutes.js'));




// Error 404
app.all("*", UserAgent.analyzely, (req, res) => {
    return res.status(404).render("../views/main/error_404.ejs", {
        title: "Error 404"
    });
});


// Creating server
http.createServer(httpsOptions, app).listen(port, () => {
    console.log("Server Runing on This Port" + port);
    console.log(`http://localhost:${port}`);
});