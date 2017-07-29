const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
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
});

let saltRounds = 10;
router.post('/signup', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.find({
      where: {
        username: username
      }
    })
    .then((user) => {
      if (user !== null) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
              console.error(err);
            } else {
              user.update({
                  password: hash
              }).then(function() {
                req.session.username = req.body.username;
                res.status(200).json('all good');
              })
              .catch(function(err) {
                  console.error(err);
                  res.status(500);
              });
            }
          });
        });
      } else {
        res.status(400).json('use our extension first to login to our site');
      }
    })
    .catch((err) => {
      res.status(500);
    });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.status(200);
      console.log('session destroyed');
    }
  });
});

router.get('/getStatus', (req, res) => {
  if (req.session.username) {
    db.User.findOne( {'where': {'username': req.session.username}} )
    .then(userEntry => {
      res.status(200).json({'username': req.session.username, 'fullname': userEntry.fullname, 'profilepicture': userEntry.profilepicture});
    });
  } else {
    console.log('no session');
    res.sendStatus(200);
  }
});

module.exports = router;
