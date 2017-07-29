const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const handler = require('./request-handler.js');
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);

const auth = require('./requestHandlers/auth.js');
const vote = require('./requestHandlers/vote.js');
const comment = require('./requestHandlers/comment.js');
const comments = require('./requestHandlers/comments.js');


const client = redis.createClient();

const app = express();

app.use(session({
  secret: 'nosuchagency',
  store: new redisStore({ host: 'localhost', port: 6379, client: client}),
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/auth/', auth);
app.use('/urlvote', vote);
app.use('/urlcomment', comment);
app.use('/urlcomments', comments);

app.get('/urldata', handler.getUrlData);

app.get('/useractivity', handler.getUserActivity);

app.get('/stats/generate-retrieve', handler.generateRetrieveStatsPageUrl);

app.get('/urlstats', handler.getUrlStats);

// TODO => for the below route send a 404 error if the corresponding url doesn't exist in the DB:

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/home', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/profile', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/login', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

app.get('/stats/redirect/*', (req, res, next) => {
  res.sendFile('./index.html', {root: path.join(__dirname, '../public')});
});

module.exports = app;
