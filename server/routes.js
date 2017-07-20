var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var handler = require('./request-handler.js');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/urlvote/:urlId', handler.getUrlVotes);

app.post('/urlvote', handler.postUrlVotes);

app.get('/urlrating', handler.getUrlRating);

module.exports = app;
