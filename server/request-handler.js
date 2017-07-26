const db = require('./db/index.js');

const handler = {};

/*eslint-disable indent*/
handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;

  db.User.findCreateFind({
      where: {
        'username': username
      }
    })
    .spread((userEntry) => {
      return db.Url.findOne({
          where: {
            'url': url
          }
        })
        .then((urlEntry) => {
          if (urlEntry === null) {
            res.json({
              'rating': null,
              'urlId': null,
              'userId': userEntry.id,
              'userVote': null
            });
          } else {
            return db.UrlVote.findOne({
                where: {
                  'userId': userEntry.id,
                  'urlId': urlEntry.id
                }
              })
              .then((voteEntry) => {
                let upvotes = urlEntry.upvoteCount;
                let downvotes = urlEntry.downvoteCount;
                rating = Math.round((upvotes / (upvotes + downvotes)) * 100);
                if (voteEntry) {
                  res.json({
                    'rating': rating,
                    'urlId': urlEntry.id,
                    'userId': userEntry.id,
                    'userVote': voteEntry.type
                  });
                } else {
                  res.json({
                    'rating': rating,
                    'urlId': urlEntry.id,
                    'userId': userEntry.id,
                    'userVote': null
                  });
                }
              });
          }
        });
    });
};

handler.getUrlVotes = (req, res) => {
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
};

handler.postUrlComment = (req, res) => {
  if (req.session.key) {
  let url = req.body.url;
  let username = req.body.username;
  let comment = req.body.comment;

  if (typeof url === 'number') {
    db.User.findCreateFind({
        where: {
          username: username
        }
      })
      .spread((user) => {
        db.Comment.create({
          text: comment,
          commentId: null,
          urlId: url,
          userId: user.id
        });
      })
      .catch(err => {
        res.sendStatus(400);
      });
  } else {
    db.Url.findCreateFind({
        where: {
          'url': url
        }
      })
      .spread(url => {
        db.User.findCreateFind({
            where: {
              username: username
            }
          })
          .spread((user) => {
            db.Comment.create({
              text: comment,
              commentId: null,
              urlId: url.id,
              userId: user.id
            });
            res.status(201).json(url.id);
          }).catch(err => {
            res.sendStatus(500);
          });
      }).catch(err => {
        res.sendStatus(500);
      });
  }
  }
};

handler.postUrlVotes = (req, res) => {
  if (req.session.key) {
  console.log(req.body);
  let url = req.body.url;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  if (typeof url === 'number') {
    db.Url.findOne({
        where: {
          id: url
        }
      })
      .then(url => {
        db.User.findCreateFind({
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
  } else {
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
            db.User.findCreateFind({
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
                  });
              }).catch(err => {
                res.sendStatus(400);
              });
          }).catch(err => {
            res.sendStatus(400);
          });
      })
      .catch(err => {
        res.sendStatus(400);
      });
  }
}
};

handler.putUrlVotes = (req, res) => {
  let url = req.body.url;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  db.Url.findOne({
      where: {
        id: url
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
};

// the following function will generate a new stat page url or retrieve one if it exists in the DB

handler.generateRetrieveStatsPageUrl = (req, res) => {
  console.log('stat page url request received');
  let currentUrl = req.query.currentUrl;
  db.Url.findCreateFind({
      where: {
        url: currentUrl
      }
    })
    .spread(url => {
      console.log('inside else');
      let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
      res.status(200).json(stpUrl);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

var bcrypt = require('bcrypt');
var saltRounds = 10;

handler.signup = function(req, res, next) {
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
                  req.session.key = req.body.username;
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
        res.status(404).json('use our extension first to login to our site');
      }
    })
    .catch((err) => {
      res.status(500);
    });
};

handler.login = function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  db.User.findOne({where: {username: username}})
  .then((user) => {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err || result === false) {
        res.status(404).json('your passwords do not match; please try again');
      }
      req.session.key = req.body.username;
      res.status(200).json('all set');
    });
  })
  .catch((err) => {
    console.error(err);
    res.status(500);
  });
};

handler.logout = function(req, res, next) {
  req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.status(200);
            console.log('session destroyed');
        }
    });
};

handler.getUserActivity = (req, res) => {
  let username = req.query.username;

  db.User.findOne({
      'where': {
        'username': username
      }
    })
    .then((userEntry) => {
      return db.UrlVote.findAll({
          'where': {
            'userId': userEntry.id
          }
        })
        .then((userVotes) => {
          return db.Comment.findAll({
              'where': {
                'userId': userEntry.id
              }
            })
            .then((userComments) => {
              res.status(200).json({
                'userVotes': userVotes,
                'userComments': userComments
              });
            })
            .catch(function(err) {
              console.error(err);
              res.sendStatus(404);
            });
        })
        .catch(function(err) {
          console.error(err);
          res.sendStatus(404);
        });
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(404);
    });
};

module.exports = handler;