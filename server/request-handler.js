const db = require('./db/index.js');
const handler = {};
var calculateRating = (upvoteCount, downvoteCount) => {
  return Math.round((upvoteCount / (upvoteCount + downvoteCount)) * 100) || null;
}
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
  console.log('------------------req.body', req.body);
  console.log('-------------------req.query', req.query);
  let urlId = JSON.parse(req.query.urlId);
  var urlData = {};
  console.log('-----------------------urlId: ', urlId);
  if (typeof urlId === 'number') {
    console.log('-----------------------------in if');
    db.Url.findOne({
      where: {
        id: urlId
      }
    })
    .then((data) => {
      urlData.rating = calculateRating(data.upvoteCount, data.downvoteCount);
      console.log('------------------urlData.rating', urlData.rating);
      return db.Comment.findAll({where: {urlId : urlId}})
      .then((results) => {
        var commentInfo = results.map(function(comment) {
          var result = {};
          result.userId = comment.userId;
          result.id = comment.id;
          result.commentId = comment.commentId;
          result.commentText = comment.text;
          return result;
        });
        return commentInfo;
      })
      .then((comments) => {
        console.log('===================comments', comments);
        var pComments = comments.map((comment, index) => {
          return db.User.findOne({where: {id: comment.userId}})
          .then((user) => {
            comment.replies = [];
            comment.username = user.username;
            if (comment.commentId) {
              comments[comment.commentId - 1].replies.push(comment);
              console.log('------------pComments first replymess', comments[comment.commentId - 1].replies[0]);
            }
            return comment;
          });
        });
        Promise.all(pComments).then((updatedComments) => {
          console.log('=================updatedComments', updatedComments);
          urlData.comments = updatedComments;
          urlData.url = data.url;
          console.log('------------urlsData:', urlData);
          res.send(urlData);
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  } else {
    console.log('-----------------------------in else');
    db.Url.findOne({
      where: {
        url: urlId
      }
    })
    .then((data) => {
      console.log('------------------data.url', data.url);
      res.send(data.url);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
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

