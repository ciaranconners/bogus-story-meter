var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');
var cors = require('cors');
var handler = require('./request-handler.js');


var app = express();

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

// app.get('/', handler.serveIndexGetRequest);

app.get('/urlvote/:urlId', handler.getUrlVotes);

app.post('/urlvote', handler.postUrlVotes);

app.get('/urlrating', handler.getUrlRating);

module.exports = app;
