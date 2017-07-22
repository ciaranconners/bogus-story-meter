var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var handler = require('./request-handler.js');
// var cors = require('cors');

var app = express();

// app.use(cors()); => at the moment CORS doesn't appear to be necessary (no errors thrown without it)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var express = require('express');
var app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/urlvote/:urlId', handler.getUrlVotes);

app.post('/urlvote', handler.postUrlVotes);

app.get('/urlrating', handler.getUrlRating);

app.get('/stats/generate-retrieve', handler.generateRetrieveStatsPageUrl);

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

module.exports = app;