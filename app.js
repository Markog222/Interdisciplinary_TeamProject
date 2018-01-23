var https = require('https'),
    express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    ejs = require('ejs');

var app = express();
var db = require('./custom_modules/db');
app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){

    db.select();
    res.render('index');

});

app.listen(3000);
console.log('running at Port 3000');
