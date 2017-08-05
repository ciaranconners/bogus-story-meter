const express = require('express'); /*eslint-disable indent*/
const router = express.Router();
const db = require('../db/index.js');

router.get('/', (req, res, next) => {
  if (req.session.username) {
  let currUser = req.session.username;
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
    return Promise.all([
      db.User.findOne({where: {id: comment.userId}}),
      db.User.findOne({where: {username: currUser}}),
    ])
    .then(([commUser, currUser]) => {
      // add current user's vote type on individual comments to persist on the front end
      if (currUser !== null) {
      return db.CommentVote.findOne({where: {userId: currUser.id, commentId: comment.id}})
      .then(vote => {
        vote ? comment.dataValues.voteType = vote.type : null;
        comment.dataValues.username = commUser.fullname || commUser.username;
        comment.dataValues.profilePic = commUser.profilepicture || 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png';
        comment.dataValues.voteCount = comment.upvoteCount - comment.downvoteCount;
        if (comment.commentId) {
          // push reply comments to replies array in parent comments
          temp[idxMap[comment.commentId]].dataValues.replies.push(comment);
        } else { return comment; }
      });
    }
    });
  })
  .then(comments => {
    res.send({comments: comments});
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
  } else {
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
    console.log('comment', comment);
    return db.User.findOne({where: {id: comment.userId}})
    .then((commUser) => {
        comment.dataValues.username = commUser.fullname || commUser.username;
        comment.dataValues.profilePic = commUser.profilepicture || 'https://ssl.gstatic.com/accounts/ui/avatar_2x.png';
        comment.dataValues.voteCount = comment.upvoteCount - comment.downvoteCount;
        if (comment.commentId) {
          // push reply comments to replies array in parent comments
          temp[idxMap[comment.commentId]].dataValues.replies.push(comment);
        } else { return comment; }
    });
  })
  .then(comments => {
    console.log(comments);
    res.send({comments: comments});
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
  }
});

module.exports = router;


