var db = require(__dirname + "/db/db_connection.js");
var sessions = require("client-sessions");
var qs = require('qs');
var url = require('url');

//dynamic pages
var express = require("express");
var app = express();
app.set("view engine", "ejs");

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

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
        var query = qs.parse(url.parse(req.url).query);
        var data;
        db.getTarget('year', req.session.tmp_email).then(function (year) {
            db.getTarget('secondary', req.session.tmp_email).then(function (secondary) {
                db.getTarget('book', req.session.tmp_email).then(function (books) {
                    db.joinedTarget(req.session.tmp_email).then(function (odata) {
                        db.joinedFlow(req.session.group, req.session.tmp_email).then(function (flow) {
                            data = {
                                flow: flow,
                                outputdata: odata,
                                year: year,
                                secondary: secondary,
                                books: books,
                                query: query
                            }
                            if (query.answer != undefined) {
                                db.insertFlow({ query: query, group: req.session.group}, req.session.tmp_email);
                                res.redirect('/days');
                            } else {
                                //console.log(data);
                                res.render('../pages/days/days', { data: data });
                            }
                        });
                    });
                });
            });
        });
    }
    
});
app.get('/goals', function (req, res) {
    if ((req.session.tmp_email == undefined) && (req.session.tmp_pass == undefined)) {
        res.render('../pages/login/login');
    } else {
        var query = qs.parse(url.parse(req.url).query);
        var data;

        db.getTarget('year', req.session.tmp_email).then(function (year) {
            db.getTarget('secondary', req.session.tmp_email).then(function (secondary) {
                db.getTarget('book', req.session.tmp_email).then(function (books) {
                    
                    data = {
                        year: year,
                        secondary: secondary,
                        books: books,
                        query: query
                    }
                    if (query.type != undefined) {
                        db.addTarget({ query: query }, req.session.tmp_email);
                        res.redirect('/goals');
                    } else {
                        //console.log(data);
                        res.render('../pages/goals/goals', { data: data });
                    }
                    

                });
            });
        });
            
       
        
        
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
                db.readUserGroup(email).then(function (rez) {
                
                    req.session.group = rez;
                    //console.log('######################req.session.group:' + req.session.group);
                
                
                    console.log("authChecked OK! COOKIE CREATED!");
                    //console.log(req.session.tmp_email + "      " + email);
                    res.redirect('/goals');
                    });
            } else {
                res.render('../pages/login/login', { data: 1 });
            }

        });
        

    } else {
        db.login(email, pwd).then(function (result) {
            if (result) {
                console.log("authChecked OK!");
                res.redirect('/goals');
            } else {
                req.session.tmp_email = undefined;
                req.session.tmp_pass = undefined;
                res.render('../pages/login/login', { req: req });
            }
            
        });

        
    }
    
});
app.get('/analytics', function (req, res) {
    res.render('../pages/soon/soon', { req: req });
});
app.get('/profile', function (req, res) {
    res.render('../pages/soon/soon', { req: req });
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