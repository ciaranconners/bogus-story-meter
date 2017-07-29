const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.post('/', (req, res, next) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let username = req.body.username || 'test@test.test';
  let comment = req.body.comment;
  let commentId = req.body.commentId || null;
  if (urlId !== null) {
    db.User.findCreateFind({where: {username: username}})
    .spread((user) => {
      db.Comment.create({text: comment, commentId: commentId, urlId: urlId, userId: user.id});
      // res.status(201).json(urlId)
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
        db.Comment.create({
          text: comment,
          commentId: null,
          urlId: url.id,
          userId: user.id
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
  }
});

module.exports = router;