var db = require(__dirname + "/db/db_connection.js");
var sessions = require("client-sessions");

//dynamic pages
var express = require("express");
var app = express();
app.set("view engine", "ejs");

app.use(sessions({
    cookieName: 'session', // cookie name dictates the key name added to the request object
    secret: 'hoscrittoquestastringaconmiofiglochemisaltaintestasullaneve', // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));


db.login('carbogninalberto@live.com', 'milanister03');

//http
var http = require("http");
var page = require(__dirname + "/pages/pages.js");
//==================== Server ====================
//handle get
//pages
app.get('/targets', function (req, res) {
    if (req.session.user.email) {
        page.targets.send_page(req, res);
    } else {
        page.login.send_page(req, res);
    }
});
app.get('/days', function (req, res) {
    if (req.session.user.email) {
        page.days.send_request(req, res);
    } else {
        page.login.send_page(req, res);
    }
});
app.get('/profile', function (req, res) {
    if (req.session.user.email) {
        //page.profile.addrequest(req, res);
    } else {
        page.login.send_page(req, res);
    }
});


//functionalities
app.get("/", page.index.send_page);
app.get("/login", page.login.send_page);


page.init(app);

//start server
app.listen(process.env.PORT || 3000);
console.log("working...");