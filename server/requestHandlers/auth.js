var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const db = require('../db/index.js');

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({where: {username: username}})
  .then((user) => {
    if (user !== null) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err || result === false) {
        res.status(400).json('your passwords do not match; please try again');
      }
      // req.session.key = req.body.username;
      req.session.username = req.body.username;
      res.status(200).json('all set');
    });
  } else {
    res.status(400).json('user not found; try again');
  }
  })
  .catch((err) => {
    console.error(err);
    res.status(500);
  });
})

module.exports = router;
