var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var handler = require('./request-handler.js');
// var cors = require('cors');

var app = express();

// app.use(cors()); => at the moment CORS doesn't appear to be necessary (no errors thrown without it)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/urlvote/:urlId', handler.getUrlVotes);

app.post('/urlvote', handler.postUrlVotes);

app.put('/urlvote', handler.putUrlVotes);

app.get('/urldata', handler.getUrlData);

app.get('/stats/generate-retrieve', handler.generateRetrieveStatsPageUrl);

// TODO => for the below route send a 404 error if the corresponding url doesn't exist in the DB:

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.post('/urlcomment', handler.postUrlComment);

module.exports = app;
