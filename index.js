var db = require(__dirname + "/db/db_connection.js");
var sessions = require("client-sessions");
var qs = require('qs');

//dynamic pages
var express = require("express");
var app = express();
app.set("view engine", "ejs");

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

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
var sessionMng = require(__dirname + "/pages/session_manager.js");
//==================== Server ====================

app.get('/', function (req, res) {
    res.render('../pages/index/index');
});
app.get('/days', function (req, res) {
    if ((req.session.tmp_email == undefined) && (req.session.tmp_pass == undefined)) {
        res.render('../pages/login/login');
    } else {
        res.render('../pages/days/days');
    }
    
});
app.get('/targets', function (req, res) {
    if ((req.session.tmp_email == undefined) && (req.session.tmp_pass == undefined)) {
        res.render('../pages/login/login');
    } else {
        res.render('../pages/targets/targets');
    }
    
});
app.get('/login', function (req, res) {
    res.render('../pages/login/login', { req: req });
});
app.post('/checkAuth', function (req, res) {
    
    var email = req.body.email;
    var pwd = req.body.pwd;
    if ((req.session.tmp_email == undefined) && (req.session.tmp_pass == undefined)) {
        db.login(email, pwd).then(function (result) {
            if (result) {
                req.session.tmp_email = email;
                req.session.tmp_pass = pwd;
                console.log("authChecked OK! COOKIE CREATED!");
                console.log(req.session.tmp_email + "      " + email);
                res.render('../pages/targets/targets', { data: 1 });
            } else {
                res.render('../pages/login/login', { data: 1 });
            }

        });
        

    } else {
        db.login(email, pwd).then(function (result) {
            if (result) {
                console.log("authChecked OK!");
                res.render('../pages/targets/targets', { data: 1 });
            } else {
                req.session.tmp_email = undefined;
                req.session.tmp_pass = undefined;
                res.render('../pages/login/login', { req: req });
            }
            
        });

        
    }
    
});

/*
//functionalities
app.get("/", page.index.send_page);
//app.get("/login", page.login.send_page);
app.get("/targets", page.targets.send_page);
app.get("/days", page.days.send_page);
*/

page.init(app);

//start server
app.listen(process.env.PORT || 3000);
console.log("working...");