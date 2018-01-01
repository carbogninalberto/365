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

exports.readUserGroup = function readUserGroup(email) {

    return new Promise(function (resolve, reject) {

        con.query("SELECT * FROM users WHERE email='" + email + "'", function (err, result, fields) {
            if (err) throw err;
            //console.log('RES QUERY:' + result[0].group_name);
            resolve(result[0].group_name);

        });
    });
};

exports.login = function login(email, password, callback) {
    var pass_md5 = md5(password);

    return new Promise(function (resolve, reject) {

        con.query("SELECT password FROM users WHERE email='" + email + "'", function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
            //console.log(pass_md5);
            //var res = JSON.stringify(result[0].password);
            //console.log(result[0].password);
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
    //console.log(targetID);
    //console.log(query.query);
    query = query.query;
    //query = JSON.parse(query.query);
    //console.log(query.type);
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
    //console.log(type);
    if ((type == "year") || (type == "secondary")) {

        return new Promise(function (resolve, reject) {
            //WHERE email='" + email + "' AND tipo=" + type + ");
            con.query("SELECT * FROM obiettivi WHERE email='" + email + "' AND tipo='" + type + "'", function (err, result, fields) {
                if (err) throw err;
                console.log("retrive Goals!");
                //console.log(result);
                resolve(result);

            });
        });
    }
    else if (type == "book") {
        return new Promise(function (resolve, reject) {

            con.query("SELECT * FROM books WHERE email='" + email + "'", function (err, result, fields) {
                if (err) throw err;
                console.log("retrive Books!");
                //console.log(result);
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

exports.joinedTarget = function joinedTarget(email) {
    return new Promise(function (resolve, reject) {
        //WHERE email='" + email + "' AND tipo=" + type + ");
        con.query("SELECT * FROM output INNER JOIN obiettivi ON obiettivi.id = output.id WHERE email= '" + email + "'", function (err, result, fields) {
            if (err) throw err;
            console.log("retrive Joined Goals!");
            //console.log(result);
            resolve(result);
        });
    });
};

exports.joinedFlow = function joinedFlow(group, email) {
    return new Promise(function (resolve, reject) {
        //SELECT * FROM flows LEFT JOIN obiettivi ON flows.id_goal = obiettivi.id
        con.query("SELECT flows.*, obiettivi.*, users.*, output.unita FROM flows INNER JOIN obiettivi ON flows.id_goal = obiettivi.id INNER JOIN users ON users.group_name = flows.group_name AND users.email = flows.email INNER JOIN output ON output.id = flows.id_goal WHERE flows.group_name= '" + group + "'", function (err, result, fields) {
            if (err) throw err;
            console.log("retrive Joined Flows!");
            //console.log(result);
            resolve(result);
        });
    });
};

exports.insertFlow = function insertFlow(query, email) {
    var targetID = uuid.v4();
    //console.log(targetID);
    
    group = query.group;
    //console.log(group);
    query = query.query;
    //console.log(query);
    var note = query.note;
    note = note.replace("'", "''");
    note = note.replace("(", "((");
    note = note.replace(")", "))");
    return new Promise(function (resolve, reject) {
        //WHERE email='" + email + "' AND tipo=" + type + ");
        //INSERT INTO `flows`(`id`, `id_goal`, `titolo`, `completato`, `quantita`, `contenuto`, `commenti`, `datetime`, `email`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5],[value-6],[value-7],[value-8],[value-9])
        con.query("INSERT INTO flows(id, id_goal, completato, quantita, contenuto, email, group_name) VALUES ('" + targetID + "','" + query.goal + "','" + query.answer + "','" + query.quantita + "','" + note + "','" + email + "','" + group +"')", function (err, result, fields) {
            if (err) throw err;
            console.log("flows TABLE UPDATED!");
            //console.log(result);
            resolve(result);
        });
    });
};