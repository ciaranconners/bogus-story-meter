var express = require('express');
var bodyParser = require('body-parser');
var handler = require('./request-handler.js');
var app = express();
var path = require('path');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', handler.serveIndexGetRequest);

module.exports = app;