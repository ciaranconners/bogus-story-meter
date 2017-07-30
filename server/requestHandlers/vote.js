const express = require('express');
const router = express.Router();

const db = require('../db/index.js');
const utils = require('../utils.js');

router.post('/', (req, res, next) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;
  let title = req.body.title;
  let categories = req.body.categories;

  if (urlId !== null) {
    db.Url.findOne({where: {id: urlId}})
    .then(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread(user => {
        db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
        .then(() => {
          db.User.increment(typeCount, {where: {id: user.id}});
          db.Url.increment(typeCount, {where: {id: url.id}});
          res.status(201).json(url.id);
        })
        .catch(err => {
          res.sendStatus(400);
        });
      })
      .catch(err => {
        res.sendStatus(400);
      });
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url, 'title': title}})
    .spread(url => {
      return db.Url.increment(typeCount, {where: {id: url.id}})
      .then(() => {
        return db.User.findCreateFind({where: {username: username}})
        .spread(user => {
          db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
          .then(() => {
            db.User.increment(typeCount, {where: {id: user.id}});
            res.status(201).json(url.id);
          }).catch(err => {
            res.sendStatus(400);
          });
        }).catch(err => {
          res.sendStatus(400);
        });
      }).catch(err => {
        res.sendStatus(400);
      });
    }).catch(err => {
      res.sendStatus(400);
    });
  }
});

router.put('/', (req, res, next) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    return db.User.findOne({where: {username: username}})
    .then(userEntry => {
      return db.UrlVote.findOne({where: {userId: userEntry.id, urlId: urlEntry.id}})
      .then(voteEntry => {
        let oldTypeCount = `${voteEntry.type}Count`;
        let oldType = voteEntry.type;
        userEntry.decrement(oldTypeCount);
        urlEntry.decrement(oldTypeCount);
        userEntry.increment(typeCount);
        urlEntry.increment(typeCount)
        .then(() => {
          db.UrlVote.update({type: type}, {where: {userId: userEntry.id, urlId: urlEntry.id}});
          res.status(201).json(urlEntry.id);
        });
      });
    });
  });
});

router.get('/:urlId', (req, res, next) => {
  let urlId = req.params.urlId;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    let rating = utils.calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
    res.json(rating);
  })
  .catch(err => {
    console.error('error getting URL votes: ', err);
    res.sendStatus(500);
  });
});

module.exports = router;
