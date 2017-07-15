var express = require('express');
var bodyParser = require('body-parser');
var handler = require('./request-handler.js');
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

module.exports = app;