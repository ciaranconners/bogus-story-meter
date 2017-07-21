const db = require('./db/index.js');


const handler = {};

/* gets rating for url
- responds with NaN if the site is in the db but never voted on,
- errors if url is not in db,
- otherwise responds with the url's rating from 0 - 100
*/
handler.getUrlRating = (req, res) => {
  let url = req.query.currentUrl;
  db.Url.findOne({where: {url: url}})
    .then(url => {
      if (url) {
        let upvotes = url.upvoteCount;
        let downvotes = url.downvoteCount;
        let rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
        res.json(rating);
      } else { res.json(null); }
    })
    .catch((err) => {
      console.log(`error retrieving rating for ${url}`);
      console.error(err);
      res.sendStatus(500);
    });
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

    db.User.findCreateFind({where: {username: username}})
    .spread(function(user) {
      db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
    });
  })

};

module.exports = handler;
