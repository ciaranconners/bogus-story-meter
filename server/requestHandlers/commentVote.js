const express = require('express');
const router = express.Router();
const db = require('../db/index.js');

router.post('/', (req, res) => {
  let username = req.session.username;
  let type = req.body.voteType;
  let commentId = req.body.commentId;

  db.User.findOne({where: {username: username}})
    .then(user => db.CommentVote.findOrCreate({
      where: {userId: user.id, commentId: commentId}, defaults: {type: type}
    }))
    .spread((vote, created) => {
      if (created) { db.Comment.increment(`${type}Count`, {where: {id: commentId}}); }
    })
    .then(() => db.Comment.findOne({where: {id: commentId}}))
    .then(comment => comment.reload()).then(comment => {
      let voteCount = comment.upvoteCount - comment.downvoteCount;
      res.json(voteCount);
    })
    .catch(err => {
      console.error('failed to post comment vote: ', err);
      res.sendStatus(500);
    });
});

router.put('/', (req, res) => {
  let username = req.session.username;
  let type = req.body.voteType;
  let commentId = req.body.commentId;
  let userId, oldType, oldTypeCount; // eslint-disable-line one-var

  db.User.findOne({where: {username: username}})
    .then((user) => userId = user.id)
    .then(() => db.CommentVote.findOne({where: {userId: userId, commentId: commentId}}))
    .then((vote) => {
      oldType = vote.type;
      oldTypeCount = `${oldType}Count`;
    })
    .then(() => db.Comment.findOne({where: {id: commentId}}))
    .then((comment) => {
      Promise.all([
        comment.decrement(oldTypeCount),
        comment.increment(`${type}Count`)
      ]);
    })
    .then(() => db.CommentVote.update(
      {type: type},
      {where: {userId: userId, commentId: commentId}}
    ))
    .then(() => db.Comment.findOne({where: {id: commentId}}))
    .then((comment) => {
      let voteCount = comment.upvoteCount - comment.downvoteCount;
      res.json(voteCount);
    })
    .catch((err) => {
      console.error('failed to update comment vote: ', err);
      res.sendStatus(500);
    });
});

router.delete('/', (req, res) => {
  let username = req.session.username;
  let type = req.query.voteType;
  let commentId = req.query.commentId;

  db.User.findOne({where: {username: username}})
    .then(user => db.CommentVote.findOne({where: {userId: user.id, commentId: commentId}}))
    .then(vote => vote.destroy())
    .then(() => db.Comment.findOne({where: {id: commentId}}))
    .then(comment => comment.decrement(`${type}Count`))
    .then(() => db.Comment.findOne({where: {id: commentId}}))
    .then(comment => comment.reload()).then(comment => {
      let voteCount = comment.upvoteCount - comment.downvoteCount;
      res.json(voteCount);
    })
    .catch(err => {
      console.error('failed to delete comment vote: ', err);
      res.sendStatus(500);
    });
});

module.exports = router;
