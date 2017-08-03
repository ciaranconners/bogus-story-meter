const express = require('express'); /*eslint-disable indent*/
const router = express.Router();
const db = require('../db/index.js');

router.post('/', (req, res) => {
  console.log(req.session.username);
  let username = req.session.username;
  let type = req.body.voteType;
  let commentId = req.body.commentId;
  let userId;
  db.User.findOne({where: {username: username}})
  .then(user => {
    userId = user.id;
    return db.CommentVote.findOne({where: {userId: userId, commentId}});
  })
  .then(vote => {
    db.CommentVote.create({type: type, commentId: commentId, userId: userId});
    return vote ? true : false;
  })
  .then((vote) => {
    if (!vote) { db.Comment.increment(`${type}Count`, {where: {id: commentId}}); }
  })
  .then(() => {
    return db.Comment.findOne({where: {id: commentId}});
  })
  .then(comment => {
    let voteCount = comment.upvoteCount - comment.downvoteCount;
    res.json(voteCount);
  })
  .catch(err => {
    res.sendStatus(400);
  });
});

module.exports = router;
