const db = require('./db/index.js');

const handler = {};

handler.serveIndexGetRequest = function(req, res) {
  res.status(200).send('hello world');
};

handler.test = function(req, res) {
  console.log('Hitting test endpoint');
  res.status(200).send('hey world');
};

handler.getUrlVotes = () => {

};

handler.postUrlVotes = (req, res) => {
  let url = req.body.url;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';
  let resObj = {};
  db.Url.findCreateFind({where: {url: url}})
    .then(url => {
      return url.increment(typeCount)
        .then(() => resObj.url = url);
    })
    .then(() => db.User.findCreateFind({where: {username: username}}))
    .then(user => {
      return user.increment(typeCount)
        .then(() => resObj.user = user);
    })
    .then(() => {
      res.status(201).send('Vote recorded');
    });
};

module.exports = handler;