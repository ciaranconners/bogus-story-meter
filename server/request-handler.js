const db = require('./db/index.js');

const handler = {};

var calculateRating = (upvoteCount, downvoteCount) => {
  return Math.round((upvoteCount / (upvoteCount + downvoteCount)) * 100) || null;
};

/*eslint-disable indent*/
handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;
  db.User.findCreateFind( {where: {'username': username}} )
  .spread((userEntry) => {
    return db.Url.findOne( {where: {url: url}} )
    .then((urlEntry) => {
      if (urlEntry === null) {
        res.json( {
          'rating': null,
          'urlId': null,
          'userId': userEntry.id,
          'userVote': null
        });
      } else {
        return db.UrlVote.findOne( {where: {'userId': userEntry.id, 'urlId': urlEntry.id}} )
        .then((voteEntry) => {
          rating = calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
          if (voteEntry) {
            res.json( {
              'rating': rating,
              'urlId': urlEntry.id,
              'userId': userEntry.id,
              'userVote': voteEntry.type
            });
          } else {
            res.json( {
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
  let url = req.body.url;
  let urlId = req.body.urlId;
  let username = req.body.username;
  let comment = req.body.comment;
  if (urlId !== null) {
    db.User.findCreateFind({where: {username: username}})
    .spread((user) => {
      db.Comment.create({text: comment, commentId: null, urlId: urlId, userId: user.id});
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
      })
      .catch(err => {
        res.sendStatus(400);
      });
    })
    .catch(err => {
      res.sendStatus(400);
    });
  }
};

handler.postUrlVotes = (req, res) => {
  console.log(req.body);
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';

  if (urlId !== null) {
    db.Url.findOne({where: {id: urlId}})
    .then(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
        console.log('--------------user inside postUrlVotes----------', user);
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
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
      return db.Url.increment(typeCount, {where: {id: url.id}})
      .then(() => {
        return db.User.findCreateFind({where: {username: username}})
        .spread((user) => {
          db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
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
};

handler.putUrlVotes = (req, res) => {
  console.log(req.body);
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username;
  let typeCount = type === 'upvote' ? 'upvoteCount' : type === 'downvote' ? 'downvoteCount' : 'neutralCount';
  db.Url.findOne( {where: {id: urlId}} )
  .then((urlEntry) => {
    db.User.findOne( {where: {username: username}} )
    .then((userEntry) => {
      db.UrlVote.findOne( {where: {userId: userEntry.id, urlId: urlEntry.id}} )
      .then((voteEntry) => {
        let oldTypeCount = voteEntry.type+'Count';
        let oldType = voteEntry.type;
        userEntry.decrement(oldTypeCount);
        urlEntry.decrement(oldTypeCount);
        userEntry.increment(typeCount);
        urlEntry.increment(typeCount)
        .then(() => {
          db.UrlVote.update( {type: type}, {where: {userId: userEntry.id, urlId: urlEntry.id}} );
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
  console.log('---------------currentUrl', currentUrl);
  if (typeof currentUrl === 'number') {
    db.Url.findCreateFind({
        where: {
          id: currentUrl
        }
      })
      .spread(url => {
        console.log('inside if');
        let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
        db.Url.update({
            statsPageUrl: stpUrl
          }, {
            where: {
              id: url.id
            }
          })
          .then(() => {
            console.log('new stat page URL created, transmitting: ', stpUrl);
            res.status(200).json(stpUrl);
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    db.Url.findCreateFind({
        where: {
          url: currentUrl
        }
      })
      .spread(url => {
        console.log('inside else');
        let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
        db.Url.update({
            statsPageUrl: stpUrl
          }, {
            where: {
              id: url.id
            }
          })
          .then(() => {
            console.log('new stat page URL created, transmitting: ', stpUrl);
            res.status(200).json(stpUrl);
          })
          .catch((err) => {
            console.error(err);
            res.sendStatus(500);
          });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
};

handler.getUrlStats = (req, res) => {
  let urlId = req.query.urlId;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    let urlData = {
      url: urlEntry.url,
      rating: calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount)
    };
    res.send(urlData);
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
};

// split comments into a separate handler to improve page load speed
handler.getUrlComments = (req, res) => {
  let urlId = req.query.urlId;
  db.Comment.findAll({where: {urlId: urlId}})
  .then(comments => {
    let idxMap = {};
    return comments.map((comment, i) => {
      idxMap[comment.id] = i;
      comment.dataValues.replies = [];
      if (comment.commentId) {
        // push reply comments to replies array in parent comments
        comments[idxMap[comment.commentId]].dataValues.replies.push(comment);
      } else { return comment; }
    });
  })
  .mapSeries(comment => {
    return !comment ? null : db.User.findOne({where: {id: comment.userId}})
    .then(user => {
      comment.dataValues.username = user.username;
      return comment;
    });
  })
  .then(comments => {
    res.send({comments: comments});
  })
  .catch(err => {
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
        res.status(400).json('use our extension first to login to our site');
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
    if (user !== null) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err || result === false) {
        res.status(400).json('your passwords do not match; please try again');
      }
      req.session.key = req.body.username;
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
};

handler.logout = function(req, res, next) {
  req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.status(200);
            console.log('session destroyed');
        }
    });
};

handler.getUserActivity = (req, res) => {
  let username = req.query.username;
  db.User.findOne( {'where': {'username': username}} )
  .then((userEntry) => {
    return db.UrlVote.findAll( {'where': {'userId': userEntry.id}} )
    .then((userVotes) => {
      return db.Comment.findAll( {'where': {'userId': userEntry.id}} )
      .then((userComments) => {

        var userVotesPromises = userVotes.map((row) => {
          return db.Url.findOne( {'where': {'id': row.urlId}} )
          .then((urlEntry) => {
            row.dataValues.url = urlEntry.url;
            return row;
          })
        })

        var userCommentsPromises = userComments.map((row) => {
          return db.Url.findOne( {'where': {'id': row.urlId}} )
          .then((urlEntry) => {
            row.dataValues.url = urlEntry.url;
            return row;
          })
        })
        Promise.all(userVotesPromises).then((userVotesNew) => {
          Promise.all(userCommentsPromises).then((userCommentsNew) => {
            res.json({'userComments': userCommentsNew, 'userVotes': userVotesNew})
          });
        });
      });
    });
  });
}

module.exports = handler;
