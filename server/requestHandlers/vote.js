const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.post('/', (req, res, next) => {
  console.log(req.body);
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  if (urlId !== null) {
    db.Url.findOne({
        where: {
          id: urlId
        }
      })
      .then(url => {
        return db.User.findCreateFind({
            where: {
              username: username
            }
          })
          .spread((user) => {
            db.UrlVote.create({
                type: type,
                userId: user.id,
                urlId: url.id
              })
              .then(() => {
                db.User.increment(typeCount, {
                  where: {
                    id: user.id
                  }
                });
                db.Url.increment(typeCount, {
                  where: {
                    id: url.id
                  }
                });
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
    db.Url.findCreateFind({
        where: {
          'url': url
        }
      })
      .spread(url => {
        return db.Url.increment(typeCount, {
            where: {
              id: url.id
            }
          })
          .then(() => {
            return db.User.findCreateFind({
                where: {
                  username: username
                }
              })
              .spread((user) => {
                db.UrlVote.create({
                    type: type,
                    userId: user.id,
                    urlId: url.id
                  })
                  .then(() => {
                    db.User.increment(typeCount, {
                      where: {
                        id: user.id
                      }
                    });
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
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';
  db.Url.findOne({
      where: {
        id: urlId
      }
    })
    .then((urlEntry) => {
      db.User.findOne({
          where: {
            username: username
          }
        })
        .then((userEntry) => {
          db.UrlVote.findOne({
              where: {
                userId: userEntry.id,
                urlId: urlEntry.id
              }
            })
            .then((voteEntry) => {
              let oldTypeCount = voteEntry.type + 'Count';
              let oldType = voteEntry.type;
              userEntry.decrement(oldTypeCount);
              urlEntry.decrement(oldTypeCount);
              userEntry.increment(typeCount);
              urlEntry.increment(typeCount)
                .then(() => {
                  db.UrlVote.update({
                    type: type
                  }, {
                    where: {
                      userId: userEntry.id,
                      urlId: urlEntry.id
                    }
                  });
                  res.status(201).json(urlEntry.id);
                });
            });
        });
    });
});

router.get('/:urlId', (req, res, next) => {
  let urlId = req.params.urlId;
  db.Url.findOne({
      where: {
        id: urlId
      }
    })
    .then(url => {
      let upvotes = url.upvoteCount;
      let downvotes = url.downvoteCount;
      let rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
      res.json(rating);
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = router;
