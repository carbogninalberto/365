var mysql = require('mysql');
var md5 = require('md5');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mindlygroup"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

exports.readTable = function readTable(name, callback) {
    con.query("SELECT * FROM " + name, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
};

exports.login = function login(email, password, callback) {
    var pass_md5 = md5(password);
    con.query("SELECT password FROM users WHERE email='" + email +"'", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        console.log(pass_md5);
    });
};