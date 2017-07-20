const db = require('./db/index.js');

const handler = {};

handler.serveIndexGetRequest = function(req, res) {
  res.status(200).send('hello world');
};

handler.test = function(req, res) {
  console.log('Hitting test endpoint');
  res.status(200).send('hey world');
};

handler.getUrlVotes = (req, res) => {
  let urlId = req.params.urlId;

  db.Url.findOne({where: {id: urlId}})
    .then(url => {
      let upvotes = url.upvoteCount;
      let downvotes = url.downvoteCount;
      let rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
      res.json(rating);
    });
};

handler.postUrlVotes = (req, res) => {
  let url = req.body.url;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';
  db.Url.findCreateFind({where: {url: url}})
    .spread(url => {
      db.Url.increment(typeCount, {where: {id: url.id}});
      res.status(201).json(url.id);
    })
    .then(() => db.User.findCreateFind({where: {username: username}}, {raw: true}))
    .spread(user => {
      return db.User.increment(typeCount, {where: {id: user.id}});
    });
};

module.exports = handler;
