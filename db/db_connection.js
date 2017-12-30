var mysql = require('mysql');
var md5 = require('md5');
var uuid = require("uuid");

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

    return new Promise(function (resolve, reject) {

        con.query("SELECT password FROM users WHERE email='" + email + "'", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            console.log(pass_md5);
            //var res = JSON.stringify(result[0].password);
            console.log(result[0].password);
            if (result[0].password == pass_md5) {
                console.log("connected");
                resolve(true);
            } else {
                console.log("wrong username or password");
                resolve(false);
            }

        });
    });
};

exports.addTarget = function addTarget(query, email) {
    var targetID = uuid.v4();
    console.log(targetID);
    console.log(query.query);
    query = query.query;
    //query = JSON.parse(query.query);
    console.log(query.type);
    if ((query.type == "year") || (query.type == "secondary")) {
        
        con.query("INSERT INTO obiettivi(email, tipo, titolo, mantra, id) VALUES ('" + email + "','" + query.type + "','" + query.titolo + "','" + query.mantra + "','"+ targetID +"');", function (err, result, fields) {
            if (err) throw err;
            console.log("obiettivi TABLE UPDATED!");

        });
        con.query("INSERT INTO output(id, azione, quantita, unita, tempo) VALUES ('" + targetID + "','" + query.azione + "','" + query.quantita + "','" + query.unita + "','" + query.tempo  + "');", function (err, result, fields) {
            if (err) throw err;
            console.log("output TABLE UPDATED!");

        });
    }
    else if (query.type == "book") {
        con.query("INSERT INTO books(email, titolo, autore) VALUES ('" + email + "','" + query.titolo + "','" + query.autore + "');", function (err, result, fields) {
            if (err) throw err;
            console.log("libri TABLE UPDATED!");

        });
    }

};

exports.getTarget = function addTarget(type, email) {
    console.log(type);
    if ((type == "year") || (type == "secondary")) {

        return new Promise(function (resolve, reject) {
            //WHERE email='" + email + "' AND tipo=" + type + ");
            con.query("SELECT * FROM obiettivi WHERE email='" + email + "' AND tipo='" + type + "'", function (err, result, fields) {
                if (err) throw err;
                console.log("retrive Goals!");
                console.log(result);
                resolve(result);

            });
        });
    }
    else if (type == "book") {
        return new Promise(function (resolve, reject) {

            con.query("SELECT * FROM books WHERE email='" + email + "'", function (err, result, fields) {
                if (err) throw err;
                console.log("retrive Books!");
                console.log(result);
                resolve(result);
            });
        });
    }

    else {
        return new Promise(function (resolve, reject) {
            resolve("[]");
        });
    }

    


};

