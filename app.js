var https = require('https'),
    express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    ejs = require('ejs');

var app = express();
app.set('view engine','ejs')
app.use(express.static(__dirname + '/views'));

app.get('/',function(req,res){

    res.render('index');

});

app.listen(5000);
console.log('running at Port 5000');
