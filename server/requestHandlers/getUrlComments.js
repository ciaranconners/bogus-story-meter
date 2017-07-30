const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.get('/', (req, res, next) => {
  let urlId = req.query.urlId;
  let idxMap = {};
  let temp;
  db.Comment.findAll({where: {urlId: urlId}})
  .then(comments => {
    temp = comments;
    return comments.map((comment, i) => {
      idxMap[comment.id] = i;
      comment.dataValues.replies = [];
      comment.dataValues.replying = false;
      return comment;
    });
  })
  .mapSeries(comment => {
    return db.User.findOne({where: {id: comment.userId}})
    .then(user => {
      comment.dataValues.username = user.username;
      if (comment.commentId) {
        // push reply comments to replies array in parent comments
        temp[idxMap[comment.commentId]].dataValues.replies.push(comment);
      } else { return comment; }
    });
  })
  .then(comments => {
    res.send({comments: comments});
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
