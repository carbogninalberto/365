﻿var fs = require('fs');
var ejs = require("ejs");

exports.send_page = function send_page(req, res) {

    //var TODO_I_AM = req.session.user.email;
    //var str = TODO_I_AM;
    //var nome_cognome = str.split(".");

    fs.readFile(__dirname + "/login.html", function (err, data) {

        var out = {
            profile: {
                /*
                name: nome_cognome[0].charAt(0).toUpperCase() + nome_cognome[0].slice(1),
                surname: nome_cognome[1].charAt(0).toUpperCase() + nome_cognome[1].slice(1)*/
            }
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(ejs.render(data.toString(), out));
        res.end();

    });

}