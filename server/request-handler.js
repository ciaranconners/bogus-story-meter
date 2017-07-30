const db = require('./db/index.js');

const handler = {};

const calculateRating = (upvoteCount, downvoteCount) => {
  rating = Math.round((upvoteCount / (upvoteCount + downvoteCount)) * 100);
  return isNaN(rating) ? null : rating;
};

/*eslint-disable indent*/
handler.getUrlData = (req, res) => {
  let url = req.query.currentUrl;
  let username = req.query.currentUser;
  let profilepicture = req.query.currentProfilePicture;
  let fullname = req.query.currentName;
  db.User.findCreateFind( {where: {'username': username, 'profilepicture': profilepicture, 'fullname': fullname}} )
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

<<<<<<< HEAD
=======
handler.getUrlVotes = (req, res) => {
  let urlId = req.params.urlId;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    let rating = calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
    res.json(rating);
  })
  .catch(err => {
    console.error('error getting URL votes: ', err);
    res.sendStatus(500);
  });
};

handler.postUrlComment = (req, res) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let username = req.body.username || req.session.username;
  let comment = req.body.comment;
  let commentId = req.body.commentId || null;
  if (urlId !== null) {
    db.User.findCreateFind({where: {username: username}})
    .spread((user) => {
      return db.Comment.create({text: comment, commentId: commentId, urlId: urlId, userId: user.id});
    })
    .then(comment => {
      res.sendStatus(201);
    })
    .catch(err => {
      res.sendStatus(400);
    });
  } else if (urlId === null) {
    db.Url.findCreateFind({where: {'url': url}})
    .spread(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread((user) => {
        db.Comment.create({text: comment, commentId: null, urlId: url.id, userId: user.id});
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
};

handler.postUrlVotes = (req, res) => {
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;

  if (urlId !== null) {
    db.Url.findOne({where: {id: urlId}})
    .then(url => {
      return db.User.findCreateFind({where: {username: username}})
      .spread(user => {
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
        .spread(user => {
          db.UrlVote.create({type: type, userId: user.id, urlId: url.id})
          .then(() => {
            db.User.increment(typeCount, {where: {id: user.id}});
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
  let url = req.body.url;
  let urlId = req.body.urlId;
  let type = req.body.type;
  let username = req.body.username || req.session.username;
  let typeCount = `${type}Count`;
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    return db.User.findOne({where: {username: username}})
    .then(userEntry => {
      return db.UrlVote.findOne({where: {userId: userEntry.id, urlId: urlEntry.id}})
      .then(voteEntry => {
        let oldTypeCount = `${voteEntry.type}Count`;
        let oldType = voteEntry.type;
        userEntry.decrement(oldTypeCount);
        urlEntry.decrement(oldTypeCount);
        userEntry.increment(typeCount);
        urlEntry.increment(typeCount)
        .then(() => {
          db.UrlVote.update({type: type}, {where: {userId: userEntry.id, urlId: urlEntry.id}});
          res.status(201).json(urlEntry.id);
        });
      });
    });
  });
};

>>>>>>> (fix) re-apply bug fixes, (feat) add back-end piece to render Comment replies on stats view properly, (cleanup) refactor some handlers to consistent code-style
// the following function will generate a new stat page url or retrieve one if it exists in the DB
handler.generateRetrieveStatsPageUrl = (req, res) => {
  let currentUrl = req.query.currentUrl;
  db.Url.findCreateFind({
      where: {
        url: currentUrl
      }
    })
    .spread(url => {
      let stpUrl = 'http://localhost:8080' + '/stats/redirect/' + url.id.toString();
      console.log('new stat page URL created, transmitting: ', stpUrl);
      res.status(200).json(stpUrl);

    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

// this function should check if there's a session first, otherwise you get type errors when the user is set to null

handler.getUrlStats = (req, res) => {
  let urlId = req.query.urlId;
  let urlData = {username: req.session.username};
  db.Url.findOne({where: {id: urlId}})
  .then(urlEntry => {
    urlData.url = urlEntry.url;
    urlData.rating = calculateRating(urlEntry.upvoteCount, urlEntry.downvoteCount);
  })
  .then(() => {
    return db.User.findOne({where: {username: urlData.username}});
  })
  .then(user => {
    return db.UrlVote.findOne({where: {userId: user.id, urlId: urlId}});
  })
  .then(vote => {
    vote ? urlData.vote = vote.type : urlData.vote = null;
    res.send(urlData);
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
};

<<<<<<< HEAD
handler.getAllActivity = (req, res) => {
  db.Url.findAll({'limit':15})
  .then(activity => {
    res.status(200).json(activity);
=======
// split comments into a separate handler to improve page load speed
handler.getUrlComments = (req, res) => {
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
>>>>>>> (fix) re-apply bug fixes, (feat) add back-end piece to render Comment replies on stats view properly, (cleanup) refactor some handlers to consistent code-style
  })
}

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
          });
        });

        var userCommentsPromises = userComments.map((row) => {
          return db.Url.findOne( {'where': {'id': row.urlId}} )
          .then((urlEntry) => {
            row.dataValues.url = urlEntry.url;
            return row;
          });
        });
        Promise.all(userVotesPromises).then((userVotesNew) => {
          Promise.all(userCommentsPromises).then((userCommentsNew) => {
            res.json({'userComments': userCommentsNew, 'userVotes': userVotesNew});
          });
        });
      });
    });
  });
};

module.exports = handler;
